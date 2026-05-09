"""
notebooks/train_disease_model.py
==================================
Train a ResNet50 CNN on the PlantVillage dataset for leaf disease detection.
"""

import os
import sys
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
import torchvision.models as models
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader, random_split
from pathlib import Path

# ── Configuration ─────────────────────────────────────────────────────────────
DATA_DIR        = Path("data/raw/plantvillage")
MODEL_SAVE_PATH = Path("backend/models/disease_model.pth")

NUM_EPOCHS    = 15
BATCH_SIZE    = 16
LEARNING_RATE = 0.0001
TRAIN_SPLIT   = 0.8

# ── Device Configuration (Mac MPS / CUDA / CPU) ─────────────────────────────
if torch.backends.mps.is_available():
    device = torch.device("mps")   # Apple Silicon GPU
elif torch.cuda.is_available():
    device = torch.device("cuda")  # NVIDIA GPU
else:
    device = torch.device("cpu")   # CPU fallback

print(f"Using device: {device}")

# ── Data Transforms ──────────────────────────────────────────────────────────
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

val_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# ── Load Dataset ─────────────────────────────────────────────────────────────
if not DATA_DIR.exists():
    print(f"ERROR: Dataset not found at {DATA_DIR}")
    sys.exit(1)

full_dataset = ImageFolder(
    root=DATA_DIR,
    transform=train_transform
)

NUM_CLASSES = len(full_dataset.classes)

print(f"Found {NUM_CLASSES} disease classes")
print(f"Total images: {len(full_dataset)}")

# ── Split Dataset ────────────────────────────────────────────────────────────
n_train = int(len(full_dataset) * TRAIN_SPLIT)
n_val   = len(full_dataset) - n_train

train_set, val_set = random_split(
    full_dataset,
    [n_train, n_val]
)

# Validation transforms
val_set.dataset.transform = val_transform

# ── Data Loaders (Mac-safe fix num_workers=0) ───────────────────────────────
train_loader = DataLoader(
    train_set,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=0
)

val_loader = DataLoader(
    val_set,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)

# ── Build ResNet50 Model ────────────────────────────────────────────────────
model = models.resnet50(
    weights=models.ResNet50_Weights.DEFAULT
)

# Freeze pretrained layers
for param in model.parameters():
    param.requires_grad = False

# Unfreeze last block for better learning
for param in model.layer4.parameters():
    param.requires_grad = True

# Replace final classifier
model.fc = nn.Sequential(
    nn.Dropout(0.4),
    nn.Linear(model.fc.in_features, NUM_CLASSES)
)

model = model.to(device)

# ── Loss + Optimizer ─────────────────────────────────────────────────────────
criterion = nn.CrossEntropyLoss()

optimizer = optim.Adam(
    model.parameters(),
    lr=LEARNING_RATE
)

scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    patience=2,
    factor=0.5
)

# ── Training Function ────────────────────────────────────────────────────────
def train_one_epoch(model, loader, optimizer, criterion, device):
    model.train()

    total_loss = 0
    correct = 0
    total = 0

    for batch_idx, (images, labels) in enumerate(loader):

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

        _, predicted = outputs.max(1)

        correct += predicted.eq(labels).sum().item()

        total += labels.size(0)

        if batch_idx % 50 == 0:
            print(
                f"Batch {batch_idx}/{len(loader)} | "
                f"Loss: {loss.item():.4f}"
            )

    accuracy = 100.0 * correct / total

    return total_loss / len(loader), accuracy

# ── Validation Function ──────────────────────────────────────────────────────
def validate(model, loader, criterion, device):

    model.eval()

    total_loss = 0
    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            loss = criterion(outputs, labels)

            total_loss += loss.item()

            _, predicted = outputs.max(1)

            correct += predicted.eq(labels).sum().item()

            total += labels.size(0)

    accuracy = 100.0 * correct / total

    return total_loss / len(loader), accuracy

# ── Main Training Loop ───────────────────────────────────────────────────────
print(f"\nStarting training for {NUM_EPOCHS} epochs...")
print("=" * 60)

best_val_acc = 0.0

for epoch in range(1, NUM_EPOCHS + 1):

    print(f"\nEpoch {epoch}/{NUM_EPOCHS}")

    train_loss, train_acc = train_one_epoch(
        model,
        train_loader,
        optimizer,
        criterion,
        device
    )

    val_loss, val_acc = validate(
        model,
        val_loader,
        criterion,
        device
    )

    scheduler.step(val_loss)

    print(f"Train Loss: {train_loss:.4f}")
    print(f"Train Accuracy: {train_acc:.2f}%")

    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Accuracy: {val_acc:.2f}%")

    # Save best model
    if val_acc > best_val_acc:

        best_val_acc = val_acc

        MODEL_SAVE_PATH.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        torch.save(
            model.state_dict(),
            MODEL_SAVE_PATH
        )

        print(f"✅ Best model saved!")
        print(f"Validation Accuracy: {val_acc:.2f}%")

print("\n" + "=" * 60)
print("Training Complete!")
print(f"Best Validation Accuracy: {best_val_acc:.2f}%")
print(f"Model saved to: {MODEL_SAVE_PATH}")
