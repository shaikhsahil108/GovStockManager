# 🚀 GovStockManager - Free Deployment & Mobile APK Guide

This guide details how to deploy **GovStockManager** completely **FREE ($0/month)** and access it as a **Web Link** or installable **Android APK**.

---

## 📱 Quick Summary of Options

| Access Method | Description | Cost | Setup Time |
| :--- | :--- | :--- | :--- |
| **1. Web Link** | Open in any browser (Mobile & Desktop) | **$0/mo** | 2 minutes |
| **2. PWA App** | Install directly from browser ("Add to Home Screen") | **$0/mo** | Instant |
| **3. Native APK** | Downloadable `.apk` file for Android | **$0/mo** | 1 minute |

---

## 🌐 STEP 1: Deploy Backend & Web App Fully Free ($0/month)

### Option A: All-in-One Deployment on Render.com (Easiest - 1 Click)

The backend Express server has been configured to serve both the API and the Frontend pages automatically!

1. **Push your code to GitHub**:
   - Create a free GitHub repository (public or private).
   - Push this project to GitHub.

2. **Deploy on Render**:
   - Sign up for a free account at [Render.com](https://render.com).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.
   - Set the following fields:
     - **Name**: `govstock-manager`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: **Free**
   - Click **Create Web Service**.

3. **Done!** Render will provide a live link like:
   `https://govstock-manager.onrender.com`
   - Opening this link opens your **Gov Stock Manager App**!
   - API endpoints run at `https://govstock-manager.onrender.com/api`.

---

### Option B: Frontend on Vercel + Backend on Render

If you prefer separated frontend and backend hosting:

1. **Backend**: Follow Step 1 above to get your Render API URL (e.g. `https://govstock-api.onrender.com`).
2. **Frontend on Vercel**:
   - Go to [Vercel.com](https://vercel.com) (Free Account).
   - Import your GitHub repository.
   - Vercel automatically detects static HTML files and deploys in seconds.
   - In `frontend/assets/js/api.js` or via browser console, set your production backend API URL:
     ```js
     localStorage.setItem('GOV_STOCK_API_URL', 'https://govstock-api.onrender.com/api');
     ```

---

## 📲 STEP 2: Accessing on Mobile Devices

### 1. Web Link (Mobile Browser)
Simply share your deployed link (e.g., `https://govstock-manager.onrender.com`) with any mobile user. It opens seamlessly in mobile Chrome, Safari, Firefox, or Edge.

### 2. PWA (Mobile App Icon without App Store)
Our app includes a Progressive Web App (`manifest.json` and `sw.js` Service Worker).
1. Open `https://govstock-manager.onrender.com` on your mobile phone.
2. Tap the **Menu (3 dots)** in Chrome or **Share button** in Safari.
3. Tap **"Add to Home Screen"** or **"Install App"**.
4. The GovStock icon appears on your mobile home screen and launches fullscreen like a native app!

---

## 📦 STEP 3: Generate Standalone Android APK (`.apk` File)

You can convert your deployed Web URL into a native Android `.apk` file in **1 minute for free**:

### Method 1: Using PWABuilder (Recommended - Zero Code)
1. Ensure your web link is deployed and live (e.g. `https://govstock-manager.onrender.com`).
2. Visit **[PWABuilder.com](https://www.pwabuilder.com)**.
3. Enter your live Web URL and click **Start**.
4. PWABuilder will analyze your PWA.
5. Click **Package for Stores** -> **Android** -> **Download APK / Package**.
6. Transfer the `.apk` file to your Android phone or share it with users.
7. Tap the `.apk` file on your Android phone to install!

---

## 🧪 Local Testing Before Deploying

To test the project locally before deploying:

1. Open terminal in `backend` folder:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Open `http://localhost:3000` in your web browser.
3. Both the backend API and frontend dashboard will be running!
