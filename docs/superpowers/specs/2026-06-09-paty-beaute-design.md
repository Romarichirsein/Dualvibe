# Design Specification: Paty Beauté Page Integration

Integration of a dedicated catalog and booking page for the partner salon "Paty Beauté" into the Dualvibe project, similar to the existing "Gab's Nails" integration.

## 1. Overview
Paty Beauté is a salon offering hair braiding (tresses africaines), nail services (onglerie), lash extensions (extension de cils), and haircuts. We will build a beautiful, responsive, and bilingual page showcasing their services and enabling customers to book via WhatsApp.

---

## 2. Requirements & Features
* **Design & Theme**: A premium dark-themed layout consistent with the Dualvibe aesthetic, featuring vibrant gradients (e.g., pink/violet/blue) and micro-animations.
* **Bilingual Support**: Fully translated in French and English.
* **Service Categories**:
  * Tresses (Braids) - utilizing actual photos provided.
  * Onglerie (Nails) - placeholder using the salon logo.
  * Cils (Lashes) - placeholder using the salon logo.
  * Coupe (Haircuts) - placeholder using the salon logo.
* **Interactive Option Modal**: For services with variable prices (e.g., Rasta Simple: Au dos at 9,500F, Au fesses at 11,500F; French Curl: Court at 10,000F, Long at 18,000F), clicking "Book" opens a modal to choose the length/placement. The modal dynamically calculates the final price and updates the WhatsApp booking text.
* **Booking Integration**:
  * Record bookings in the `partner_bookings` Supabase table.
  * Send email notifications via the `/api/notify-order` API endpoint.
  * Redirect the customer to WhatsApp with a pre-filled French/English message.
* **Promotional Card**: Add a custom promo card to the main [Services.tsx](file:///c:/Users/COMPUTER%20STORES/Desktop/Dualvibe/src/pages/Services.tsx) page.

---

## 3. Product & Service Catalog Data
We will construct a catalog containing the following services:

### A. Braids (Tresses)
* **Rasta Simple**:
  * Options: Au dos (9,500 FCFA), Au fesses (11,500 FCFA)
  * Image: `/products/paty-beaute/Knotless - Rasta américain.jpeg`
* **Rasta avec Boucle**:
  * Options: Au dos (11,000 FCFA), Au fesses (13,500 FCFA)
  * Image: `/products/paty-beaute/Knotless avec rajout.jpeg`
* **French Curl**:
  * Options: Court (10,000 FCFA), Long (18,000 FCFA)
  * Image: `/products/paty-beaute/French curl.jpeg`
* **Passion Twist**:
  * Options: Court (8,500 FCFA), Long (14,000 FCFA)
  * Image: `/products/paty-beaute/Twist.jpeg`
* **Passe Mèche Américaine**:
  * Options: Court (5,500 FCFA), Long (7,000 FCFA)
  * Image: `/products/paty-beaute/Passe mèche américain.jpeg`
* **Invisible Locs**:
  * Options: Simple (9,000 FCFA), Avec Passe Mèche (9,000 FCFA)
  * Image: `/products/paty-beaute/Braid locks.jpeg`
* **Braids Locs**:
  * Options: Au dos (11,000 FCFA), Au fesses (12,500 FCFA)
  * Image: `/products/paty-beaute/Braid locks.jpeg`
* **Rasta et Passe Mèche**:
  * Options:
    * Simple Au dos (10,000 FCFA)
    * Simple Au fesses (12,000 FCFA)
    * Avec Boucle Au dos (12,000 FCFA)
    * Avec Boucle Au fesses (14,000 FCFA)
  * Image: `/products/paty-beaute/Fulani braid.jpeg`
* **Other Braids Styles (from folder images)**:
  * **Coco Twist**: 2,500 FCFA (à partir de) - Image: `/products/paty-beaute/Coco twist.jpeg`
  * **Fulani Braid**: 2,500 FCFA (à partir de) - Image: `/products/paty-beaute/Fulani braid 1.jpeg`
  * **Italian Curl**: 2,500 FCFA (à partir de) - Image: `/products/paty-beaute/Italian curl.jpeg`
  * **Short French Curl**: 10,000 FCFA - Image: `/products/paty-beaute/Short French curl.jpeg`
  * **Stichtbraid**: 2,500 FCFA (à partir de) - Image: `/products/paty-beaute/Stichtbraid - passe mèche américain.jpeg`

### B. Onglerie (Nails)
* **Pose Ongles Simple / Capsules**: 1,000 FCFA (à partir de) - Image: `/products/paty-beaute/logo.png` (Placeholder)

### C. Extensions de Cils (Lashes)
* **Extension de Cils**: 2,500 FCFA (à partir de) - Image: `/products/paty-beaute/logo.png` (Placeholder)

### D. Coupe femme et enfants (Haircuts)
* **Coupe Cheveux**: 2,000 FCFA (à partir de) - Image: `/products/paty-beaute/logo.png` (Placeholder)

---

## 4. Implementation Steps
1. **Asset Copying**: Copy all files from `Dual vibe products/Services/paty beaute/` to `public/products/paty-beaute/` in the workspace.
2. **Route Setup**: Import and define route `/paty-beaute` in [App.tsx](file:///c:/Users/COMPUTER%20STORES/Desktop/Dualvibe/src/App.tsx).
3. **Services Page Promotion**: Insert a new promo section for Paty Beauté in [Services.tsx](file:///c:/Users/COMPUTER%20STORES/Desktop/Dualvibe/src/pages/Services.tsx).
4. **Main Page Component**: Create [PatyBeaute.tsx](file:///c:/Users/COMPUTER%20STORES/Desktop/Dualvibe/src/pages/PatyBeaute.tsx) with:
   * Header hero section with contact details, address (Bonaloka), opening hours, and description.
   * Filter controls for service categories.
   * Grid layout displaying service cards with their names, starting prices, and custom tags.
   * Selection Modal for choosing options (Length/Placement) and seeing real-time pricing before booking.
   * WhatsApp redirection + API booking hooks.
