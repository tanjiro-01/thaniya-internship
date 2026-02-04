# med-app - thaniya-internship
A frontend-only healthcare portal demonstrating patient-centric, privacy-first medical record management.

## How to Run

### Method 1: Direct File Opening (Simplest)
1. Simply double-click `index.html` to open it in your default web browser
2. **Note:** Requires internet connection for Font Awesome icons

### Method 2: Using Python HTTP Server

Open a terminal in this directory and run:

**Python 3:**
```bash
python -m http.server 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```


### Method 3: Using VS Code Live Server

If you're using Visual Studio Code:
1. Right-click on `index.html`
2. Select "Open with Live Server"

## Project Structure

```
├── index.html      # Main HTML file with all sections
├── style.css       # Healthcare-themed styling
├── script.js       # Interactive functionality
└── README.md       # This file
```

## Features

- Patient Dashboard with security status
- Medical History Timeline (encrypted indicators)
- Consent & Access Control with toggle switches
- Emergency Access Mode with biometric confirmation
- Privacy & Security Indicators
- Access Log
- Interoperability Awareness (conceptual)

## Notes

- This is a **UI/UX demonstration** project
- No backend or real encryption is implemented
- All security features are visually represented
- Mock data is used throughout

