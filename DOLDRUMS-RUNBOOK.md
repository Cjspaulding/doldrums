# Doldrums — Update Runbook

*The paper's production manual. Last updated: July 7, 2026 (v1.1 approved).*

---

## The two update paths

**Web-only change** (doldrums.app + home-screen app): Steps 1–4. Takes ~5 minutes, live immediately.
**App Store release** (new version through Apple): Steps 1–4, then 5–12. Takes ~1 hour of work + review wait.

The App Store app carries a frozen copy of index.html — it only updates via a new release. The website and home-screen app update on every commit.

---

## Part 1 — Web deploy (every update starts here)

1. **Edit** `index.html` (single file, whole app). Work with Claude or edit directly.
2. **Test locally first:** double-click the file, open in Chrome, verify. Never commit untested.
   - Geolocation won't fire from a local file (needs https) — test that on the live site in an incognito window instead.
3. **Commit:** github.com/Cjspaulding/doldrums → Add file → Upload files → drag `index.html` → short commit message → Commit. (Filename must be exactly `index.html` — no "(1)".)
4. **Vercel auto-deploys** (~1 min). Verify at doldrums.app. Home-screen app picks it up next launch (force-quit once if stale).

**Don't touch without care:** `vercel.json` (routing — /support and /privacy rewrites live here), `support.html`, `privacy.html`, `sw.js`.

---

## Part 2 — App Store release

**5. Refresh the bundle** (Terminal):
```
cp ~/Downloads/index.html ~/doldrums-app/www/index.html
ls -la ~/doldrums-app/www/          # verify size + today's date
cd ~/doldrums-app && npx cap sync ios
```
Wait for "Sync finished."

**6. Open Xcode:**
```
open ~/doldrums-app/ios/App/App.xcodeproj
```
(It's `.xcodeproj`, not `.xcworkspace`.) Ignore the yellow "Update to recommended settings" nag — never accept it right before an archive.

**7. Bump version:** blue App icon in sidebar → App target → General → Identity:
- **Version:** next number (1.1 → 1.2)
- **Build:** always +1 from last upload (Apple rejects reused build numbers)

**8. Simulator smoke test:** device selector → any iPhone simulator → ▶. Verify the app boots and new features work. (Simulator = fresh install: good for testing first-launch behavior.)

**9. Archive:** device selector → **Any iOS Device (arm64)** → Product → Archive. Close Chrome/simulator first (RAM). Organizer window opens with the new archive.

**10. Upload:** Distribute App → App Store Connect → Upload → accept all defaults → wait for "Upload Successful." Apple then processes ~15–30 min (email arrives when done).

**11. App Store Connect** (appstoreconnect.apple.com → Doldrums → Distribution):
- Left sidebar → **⊕ next to iOS App** → new version number → Create
- **What's New:** write the release notes (public)
- **Build section:** ⊕ → select the new build (appears after processing)
- **Notes field (App Review Information):** brief note to reviewer on what changed; clear out old text
- **Save** → **Add for Review** → **Submit for Review**

**12. Wait.** Status goes Waiting for Review → In Review → decision by email. Recent history: 1.0.1 took ~3 days; 1.1 took ~5 hours. Auto-release is on, so approval = live within hours.

---

## Facts worth not re-discovering

- **App ID / direct link:** https://apps.apple.com/app/id6767381491
- **Bundle ID:** app.doldrums.www · **Team ID:** 52XDK4R96X
- **Capacitor project:** `~/doldrums-app` (config: `webDir: "www"` — bundled, not remote)
- **Support email:** support@doldrums.app → forwards to cjspaulding@gmail.com (Porkbun)
- **Encryption compliance:** handled forever via `ITSAppUsesNonExemptEncryption = NO` in Info.plist — no dialog should appear
- **Location permission:** purpose string lives in Info.plist (`NSLocationWhenInUseUsageDescription`)
- **Data sources:** Open-Meteo (weather), RainViewer (radar), Nominatim (geocoding), Iowa State IEM (forecast discussion — endpoint: `/api/1/nws/afos/list.json?pil=AFD{WFO}&date=YYYY-MM-DD`, strict params, newest entry is LAST)
- **Never do:** set Capacitor `hostname` to doldrums.app — it changes the WebView origin and wipes every app user's saved cities and field notes

## If something breaks

- **Upload fails with PLA/certificate errors** → developer.apple.com/account → accept any pending license agreement → retry (archive survives; no rebuild needed)
- **Build not selectable in App Store Connect** → still processing; check TestFlight tab or wait for email
- **Site looks broken after deploy** → compare against local copy; Vercel dashboard → Deployments → Rollback is one click
- **Rejected** → read the Resolution Center message first; fix, re-archive with build +1, reply to the reviewer describing fixes, resubmit

## The 1.2 pile (as of this writing)

Front page (discussion above the fold) · location prompt softening (Capacitor Geolocation plugin + editorial pre-prompt) · composer fixes ("Log Entry" → "Field Note", save button hidden by keyboard) · desktop polish (card width, header widget, clipped rain amounts)
