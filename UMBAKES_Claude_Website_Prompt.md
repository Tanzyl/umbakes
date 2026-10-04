# MASTER PROMPT: Build a Premium Custom Cake & Bakery Website for UMBAKES

Act as a **senior full-stack developer, UI/UX designer, creative
director, and software architect**. Your task is to design and develop a
complete, modern, elegant, premium, and fully responsive bakery website
for **UMBAKES**, a custom cake and bakery business specializing in
personalized cakes and other freshly baked products.

The website should feel like a premium, professional bakery brand, not a
generic e-commerce template.

The main focus is to **showcase beautiful custom cake designs, attract
customers, and allow them to place orders directly through WhatsApp**.

Use the following references as your primary source of brand identity
and content.

## 1. Brand References and Assets

**Official Instagram profile:** <https://www.instagram.com/umbakes_/>

**Instagram menu post:** <https://www.instagram.com/p/DccKObzo9-H/>

**Owner's image:** <https://www.instagram.com/p/DbHO3YzI5yF/>

### Instructions for using the references

-   Analyze the Instagram profile to understand the brand's logo,
    colors, fonts, visual identity, cake designs, photography style, and
    overall aesthetic.
-   Use the logo and color palette from the Instagram profile as the
    foundation for the website theme.
-   Review the menu post to identify the available bakery categories and
    products.
-   Use actual cake images and other bakery product images from the
    Instagram profile wherever possible.
-   Use the owner's photo for an optional About Us or Meet the Baker
    section, if appropriate.
-   Do not invent business details, contact numbers, product prices, or
    customer reviews.
-   If Instagram content cannot be accessed directly, inspect any
    available local assets or ask for the images to be supplied. Do not
    silently replace brand assets with unrelated stock photography.
-   Keep the design consistent with the original brand, while making the
    overall website look more professional and polished.

The website must be designed around the actual brand identity, not a
random color scheme.

------------------------------------------------------------------------

## 2. Technology Stack

Use the following technologies:

-   **Frontend:** Next.js with TypeScript
-   **Styling:** Tailwind CSS
-   **Backend:** Next.js server-side architecture and API routes or
    server actions
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Authentication:** Secure admin authentication
-   **Image management:** Secure uploads stored in a project-local
    folder (for example, `public/uploads/`), with image paths and
    metadata stored in PostgreSQL
-   **Animations:** Framer Motion or an appropriate modern animation
    library
-   **Icons:** Lucide React
-   **Forms:** React Hook Form with Zod validation where useful
-   **Notifications:** Elegant toast notifications
-   **Deployment:** Production-ready architecture suitable for a VPS or
    cloud deployment

Use stable, compatible versions and follow modern Next.js conventions.

If an existing project is present, inspect its structure and
dependencies before making any architectural changes. Preserve working
functionality and avoid unnecessary rewrites.

------------------------------------------------------------------------

## 3. Main Website Design and Visual Experience

Create an elegant, premium, modern bakery website with an excellent user
experience.

The overall visual design should be:

-   Elegant and visually appealing.
-   Minimal but not empty.
-   Premium and sophisticated.
-   Warm, welcoming, and bakery-inspired.
-   Image-focused, particularly for custom cakes.
-   Smooth and responsive across desktop, tablet, and mobile.
-   Easy to understand for customers of all ages.
-   Fast-loading and optimized for mobile users.

### Design guidelines

Use the brand's actual logo and colors to establish a balanced visual
system.

Possible visual elements, subject to the actual logo and Instagram
aesthetic:

-   Soft cream or warm ivory backgrounds.
-   Subtle pastel shades.
-   Elegant typography.
-   Carefully selected accent colors.
-   Beautiful cake photography.
-   Soft shadows and refined borders.
-   Generous whitespace.
-   Rounded image corners where appropriate.
-   Delicate hover effects.
-   Smooth transitions and subtle scrolling animations.

Avoid:

-   Overly complicated layouts.
-   Excessive animations.
-   Too many colors.
-   Huge blocks of text.
-   Unnecessary gradients.
-   Generic e-commerce layouts.
-   Tiny buttons and difficult navigation.
-   Cluttered product cards.

The overall website should look like a real, professionally designed
bakery brand.

------------------------------------------------------------------------

## 4. Homepage: The Main Focus

The homepage is the most important part of this project.

It should showcase the bakery's identity, products, custom cake designs,
categories, and ordering options in a well-organized and visually
engaging layout.

### Section 1: Navigation Bar

Create a premium navigation bar featuring:

-   UMBAKES logo.
-   Home.
-   Custom Cakes.
-   Menu.
-   Our Gallery.
-   About Us.
-   Contact.
-   A prominent WhatsApp Order button.
-   Mobile-friendly navigation menu.

The navbar should be elegant and compact.

Consider a sticky navbar with a subtle background and smooth transition
when scrolling.

Make sure the navigation is intuitive and easy to use.

### Section 2: Hero Section

Create a beautiful, visually striking hero section that immediately
communicates the bakery's main offering.

The hero section should feature:

-   A large, high-quality image of an attractive custom cake.

-   A premium headline, such as:

    "Every Cake Tells a Story"

-   Supporting text, such as:

    "Beautifully crafted cakes and sweet treats, designed especially for
    your special moments."

-   A primary CTA: "Explore Our Cakes"

-   A secondary CTA: "Order on WhatsApp"

Use actual UMBAKES cake images whenever possible.

Consider a modern split layout with the text on one side and an elegant
cake image on the other, or a full-width editorial hero with carefully
placed typography.

Use smooth entrance animations without delaying the main content.

The hero content, text, images, buttons, and visibility should all be
editable from the admin dashboard.

### Section 3: Featured Custom Cakes

This is one of the most important sections.

Showcase the bakery's custom cake designs in a visually rich gallery.

Include cake types such as:

-   Birthday Cakes
-   Wedding Cakes
-   Bridal Cakes
-   Engagement Cakes
-   Anniversary Cakes
-   Kids' Theme Cakes
-   Customized Photo Cakes
-   Floral Cakes
-   Minimalist Cakes
-   Luxury Cakes
-   Baby Shower Cakes
-   Graduation Cakes
-   Character Cakes
-   Other Custom Designs

These are suggested categories, not fixed requirements. Admins should be
able to add, edit, remove, reorder, and hide categories.

Each cake card should include:

-   Cake image.
-   Cake name or design title.
-   Short description, if available.
-   Optional price or starting price.
-   View Design button.
-   Order on WhatsApp button.

Clicking a cake should open a modern image modal or detail view
featuring:

-   Large image.
-   Cake name.
-   Additional images, if available.
-   Description.
-   Available customization information.
-   Price, if configured.
-   WhatsApp order button.
-   Previous and next image navigation, where appropriate.

The design gallery should feel like a premium visual portfolio rather
than a basic product catalog.

### Section 4: Explore Our Menu

Create an attractive bakery menu section using categories from the
official menu post.

The main product categories should include:

1.  Custom Cakes
2.  Cupcakes
3.  Brownies
4.  Mousse
5.  Cookies
6.  Tea Snacks

You can also add suggested categories such as:

-   Bento Cakes
-   Cake Pops
-   Dessert Boxes
-   Mini Cakes
-   Seasonal Specials
-   Gift Boxes

Do not assume every suggested category is actually offered. All
categories must be manageable from the admin dashboard.

Display menu categories using beautiful image-based cards.

For example:

-   An elegant cupcake image for Cupcakes.
-   A delicious brownie image for Brownies.
-   A mousse dessert image for Mousse.
-   A cookie arrangement for Cookies.

Each category card should have:

-   Category image.
-   Category title.
-   Short description, if configured.
-   A clear way to explore that category.

When the customer clicks a category, open a dedicated category page or
an elegant category overlay that displays the relevant products.

The customer should never have to navigate through an unnecessarily
complicated process.

### Section 5: Popular and Featured Products

Create a section for popular products and selected bakery items.

Allow admins to mark items as:

-   Featured.
-   Popular.
-   New Arrival.
-   Seasonal Special.

Show a curated selection on the homepage.

Each product card should contain:

-   Product image.
-   Name.
-   Short description.
-   Price, when available.
-   View Details.
-   Order Now.

Keep the card design consistent and visually appealing.

The admin must be able to control which products appear here and in what
order.

### Section 6: Special Occasions

Add a dedicated section highlighting the custom cakes created for
special moments.

Suggested occasion categories:

-   Birthdays.
-   Weddings.
-   Bridal Showers.
-   Engagements.
-   Anniversaries.
-   Baby Showers.
-   Kids' Parties.
-   Graduations.
-   Corporate Events.

Use an attractive image grid, horizontal gallery, or editorial layout.

This section should emphasize the personalization and craftsmanship of
UMBAKES.

Add a CTA such as:

"Have a Special Design in Mind?"

With a button:

"Discuss Your Custom Cake"

The button should open WhatsApp with a prefilled message.

### Section 7: Cake Inspiration Gallery

Create an image-focused gallery that showcases the bakery's work.

Features:

-   Masonry or editorial image layout.
-   High-quality product photography.
-   Responsive image grid.
-   Smooth image loading.
-   Hover interactions.
-   Click-to-expand lightbox.
-   Previous and next navigation.
-   Optional category filtering.

Allow users to filter designs by categories such as Birthday, Wedding,
Bridal, Kids, and more.

The gallery must support adding, editing, removing, and categorizing
images from the admin dashboard.

### Section 8: About UMBAKES

Create a visually attractive About Us section.

Use the supplied owner image where suitable.

Suggested heading:

"Made with Love, Crafted for Your Moments"

Possible content:

"At UMBAKES, every creation is made to bring a little more sweetness to
your special moments. From beautifully designed celebration cakes to
delightful everyday treats, our focus is on creativity, quality, and
your personal preferences."

This is placeholder copy. Make the text editable from the admin panel
and allow the owner to replace it with the actual business story.

Include:

-   Owner or baker image.
-   Brand introduction.
-   Short description of the bakery.
-   Optional experience or business milestones, if supplied.
-   A button to explore the cake gallery.

Do not invent qualifications, years of experience, awards, or other
factual claims.

### Section 9: How to Order

Explain the ordering process in a very simple way.

Use three or four visually clear steps.

**Step 1: Explore Designs**

Browse the cake gallery and bakery menu.

**Step 2: Choose Your Favorite**

Select an existing design or use it as inspiration for a custom cake.

**Step 3: Contact Us**

Click the WhatsApp button and send your selected item or custom
requirements.

**Step 4: Confirm Your Order**

Discuss availability, customization, price, delivery or pickup, and
other details directly with the bakery.

Keep this section simple and easy to understand.

### Section 10: Customer Reviews

Create a customer feedback section.

Features:

-   Customer name.
-   Review text.
-   Optional rating.
-   Optional customer image.
-   Review cards or a carousel.

Only display actual reviews supplied by the owner or obtained through a
verified source.

Allow the admin to add, edit, approve, hide, and remove reviews.

If Google reviews are integrated, use a legitimate supported method
rather than scraping.

### Section 11: Instagram Section

Add an Instagram showcase section.

Suggested heading:

"Follow Our Sweet Creations"

Use the official Instagram account:

<https://www.instagram.com/umbakes_/>

Display recent posts only through an appropriate, authorized integration
or admin-managed images.

If a live Instagram integration is unavailable, use a manually managed
gallery populated with selected Instagram images.

Include a clear Instagram follow link.

Do not create a fake live Instagram feed.

### Section 12: Contact and Footer

Include:

-   UMBAKES logo.
-   Short brand description.
-   Navigation links.
-   Product categories.
-   WhatsApp contact.
-   Instagram profile.
-   Business location, only if supplied.
-   Opening hours, only if supplied.
-   Copyright information.
-   Privacy policy.
-   Terms and conditions, if needed.

Make the footer attractive, simple, and consistent with the overall
visual identity.

------------------------------------------------------------------------

## 5. WhatsApp Ordering System

WhatsApp is the primary ordering and customer communication channel.

There must be a floating WhatsApp icon on the website, especially on
mobile.

The icon should remain accessible without covering important content or
interfering with other controls.

Use the official WhatsApp click-to-chat URL format:

`https://wa.me/PHONE_NUMBER?text=ENCODED_MESSAGE`

Store the WhatsApp number in the admin settings.

Do not hardcode the phone number throughout the application.

### Product ordering

Every product and cake design should have its own Order on WhatsApp
button.

When a customer clicks the button, open WhatsApp with a prefilled
message that includes:

-   A greeting.
-   Product name.
-   Product category.
-   Product reference ID.
-   Product page URL.
-   Product price, if available.
-   A request to discuss availability and customization.

Example:

"Hi UMBAKES! I am interested in ordering the following item.

Product: Floral Birthday Cake Category: Birthday Cakes Reference ID:
CAKE-102 Reference Link:
<https://example.com/cakes/floral-birthday-cake> Price: PKR 4,500

I would like to discuss the details of this order."

The product reference link is particularly important.

**Every WhatsApp order message must identify the exact design or product
the customer selected.**

This allows the owner to identify the design without asking the customer
to explain which image they are referring to.

Use the actual current website URL and product data when generating
messages.

### Custom cake ordering

For customers who want a completely new design, create a dedicated
custom cake inquiry option.

The inquiry should support the following details:

-   Occasion.
-   Cake theme.
-   Preferred design.
-   Cake size or servings.
-   Flavor preference.
-   Desired date.
-   Additional instructions.

Make it possible to submit the inquiry directly through WhatsApp.

Use a prefilled message containing the entered details.

Do not require customers to create an account.

The inquiry flow should be optional and easy to complete.

### Floating WhatsApp button

Create a floating WhatsApp contact button with:

-   WhatsApp icon.
-   Subtle animation.
-   Mobile-friendly positioning.
-   Accessible label.
-   Configurable greeting or message.

The button should always use the admin-configured WhatsApp number.

------------------------------------------------------------------------

## 6. Product Details and Category Navigation

Build a complete, dynamic product and category system.

### Category pages

Each category should have its own page or dynamically rendered category
view.

For example:

-   `/menu/cupcakes`
-   `/menu/brownies`
-   `/menu/cookies`
-   `/cakes/birthday`
-   `/cakes/wedding`

Each page should contain:

-   Category title.
-   Category description.
-   Category banner or image.
-   Relevant products.
-   Responsive product grid.
-   Optional filtering.
-   Product detail modal or page.

### Product detail view

When a user clicks a product image or card, open a premium product
detail modal or navigate to a dedicated page.

The detail view should support:

-   Large product images.
-   Image gallery.
-   Product title.
-   Description.
-   Category.
-   Price or starting price.
-   Customization information.
-   WhatsApp order button.
-   Related designs, where appropriate.

The modal should have:

-   Smooth opening and closing animation.
-   Close button.
-   Escape-key support.
-   Mobile-friendly layout.
-   Proper focus and accessibility handling.
-   Image navigation when multiple images exist.

Use a clean, modern experience inspired by high-quality editorial
shopping websites.

Do not make users click through several pages just to see a cake image.

------------------------------------------------------------------------

## 7. Admin Dashboard: Complete Content Management

Create a secure and easy-to-use admin dashboard.

The bakery owner should be able to manage the website without needing
programming knowledge.

The admin dashboard is a major requirement, not an optional addition.

Use a simple, clean interface with understandable labels and clear
actions.

### Admin dashboard overview

Show useful information such as:

-   Total categories.
-   Total products.
-   Total gallery images.
-   Featured products.
-   Published and hidden items.
-   Recent content changes.
-   Quick management actions.

Avoid unnecessary complex analytics.

### Category management

Admins must be able to:

-   Create categories.
-   Edit category names.
-   Update descriptions.
-   Upload category images.
-   Change category slugs.
-   Set display order.
-   Show or hide categories.
-   Delete categories.
-   Assign categories to appropriate sections.

Deleting a category should be handled carefully if products are
associated with it.

Use confirmation dialogs and clear warnings.

### Product management

Admins must be able to:

-   Add products.
-   Edit products.
-   Delete products.
-   Upload multiple images.
-   Set product names.
-   Write descriptions.
-   Assign categories.
-   Set prices.
-   Mark prices as starting prices.
-   Mark products as featured.
-   Mark products as popular.
-   Set product availability.
-   Publish or hide products.
-   Change product ordering.
-   Add product reference IDs.
-   Manage product-specific WhatsApp messages.

For custom cakes, allow flexible pricing because the final price may
depend on size, flavor, complexity, and customization.

Support optional fields instead of forcing every cake to have a fixed
price.

### Cake gallery management

Admins should be able to:

-   Upload cake designs.
-   Add multiple images per design.
-   Create design titles.
-   Write descriptions.
-   Assign cake categories.
-   Set featured gallery items.
-   Reorder gallery images.
-   Replace existing images.
-   Remove images.
-   Hide or publish gallery entries.

Support drag-and-drop upload and preview if practical.

### Homepage management

Allow the owner to update the homepage without changing source code.

Editable elements should include:

-   Hero heading.
-   Hero description.
-   Hero image.
-   Hero buttons and labels.
-   Featured cake selections.
-   Featured products.
-   Homepage category order.
-   Section headings.
-   Section descriptions.
-   About Us content.
-   Owner image.
-   Instagram section visibility.
-   Reviews section visibility.
-   Gallery visibility.
-   Special occasions visibility.
-   Section ordering, if practical.

Allow each homepage section to be enabled or disabled.

### Image and media management --- store uploads inside the project

**All images uploaded through the admin dashboard must be stored in a
folder inside the project itself**, not in an external cloud storage
service.

Use a clear, configurable directory such as:

-   `public/uploads/` for uploaded images that should be publicly
    accessible.
-   Organize files into subfolders where useful, such as
    `public/uploads/products/`, `public/uploads/categories/`,
    `public/uploads/gallery/`, and `public/uploads/site/`.

Requirements:

-   Save uploaded files to the project folder on the server.
-   Store each image's relative path or URL, plus relevant metadata, in
    PostgreSQL. Do not store the image binary in the database.
-   Use generated, unique filenames; do not trust the original filename
    as a storage path.
-   Validate file type, actual file content, and file size.
-   Prevent path traversal and unsafe file access.
-   Provide image previews, replacement, deletion, and alt-text editing
    in the admin dashboard.
-   When an image is replaced or deleted, handle its old file carefully
    so unrelated or still-used assets are not removed.
-   Make the upload directory configurable through an environment
    variable such as `UPLOAD_DIR`, with a sensible project-local
    default.
-   Ensure the application creates the upload directories when needed
    and handles missing folders or write-permission errors gracefully.
-   Configure the production server so uploaded files remain available
    after restarts and deployments. Do not assume a fresh build or
    deployment will preserve runtime uploads; document the required
    persistent directory, backup, and deployment steps.
-   Keep uploaded public images separate from secrets, source code, and
    private admin files.
-   Do not use external image hosting or cloud storage unless explicitly
    requested later.

Support:

-   Uploading images.
-   Image previews.
-   Replacing images.
-   Deleting unused images.
-   Organizing assets.
-   Image optimization.
-   File type validation.
-   File size limits.
-   Meaningful alt text.

### Website settings

Create a settings area where the admin can manage:

-   Business name.
-   Logo.
-   Favicon.
-   Brand colors, within a controlled theme system.
-   WhatsApp number.
-   Instagram URL.
-   Contact details.
-   Business location.
-   Business hours.
-   Default WhatsApp greeting.
-   SEO title.
-   SEO description.
-   Social sharing image.
-   Footer content.
-   Website maintenance or visibility settings, if appropriate.

Ensure changes are reflected on the frontend dynamically.

### Admin authentication and security

Implement:

-   Secure admin login.
-   Password hashing.
-   Protected admin routes.
-   Server-side authorization.
-   Secure session handling.
-   Input validation.
-   Upload validation.
-   CSRF protection where applicable.
-   Rate limiting for sensitive endpoints.
-   Safe error handling.

Do not expose admin credentials, database connection details, or secret
environment variables to the browser.

Do not provide public write access to management APIs.

------------------------------------------------------------------------

## 8. PostgreSQL Database Design

Create a well-structured and scalable relational database schema using
Prisma.

Suggested models include:

-   AdminUser
-   Category
-   Product
-   ProductImage
-   GalleryItem
-   GalleryImage
-   HomepageSection
-   WebsiteSettings
-   Review
-   MediaAsset

You may introduce additional models where they provide genuine value.

### Database requirements

-   Use proper primary keys.
-   Use unique slugs where appropriate.
-   Define appropriate relations.
-   Add timestamps.
-   Use indexes for frequently queried fields.
-   Support product availability.
-   Support product visibility.
-   Support dynamic category ordering.
-   Support flexible product pricing.
-   Support multiple images.
-   Support homepage section visibility.
-   Support content updates without redeployment.

Use database migrations.

Include seed data for development, but clearly label sample products and
reviews so they are not mistakenly published as real business content.

Plan for future growth without overengineering.

------------------------------------------------------------------------

## 9. Modern UI Interactions and Animations

The website should feel smooth, refined, and enjoyable to use.

Implement subtle, purposeful animations such as:

-   Hero image entrance.
-   Text fade-in.
-   Scroll-triggered section reveals.
-   Smooth hover effects on product cards.
-   Image zoom on hover.
-   Smooth category transitions.
-   Modal opening and closing.
-   Elegant page transitions, if suitable.
-   Subtle navigation transitions.
-   Loading skeletons where useful.

Use Framer Motion or an equivalent solution.

Animation requirements:

-   Keep animations lightweight.
-   Avoid unnecessary movement.
-   Support reduced-motion preferences.
-   Avoid layout shifts.
-   Never delay important content.
-   Ensure interactions remain smooth on mobile devices.

Use modern interaction patterns such as image lightboxes, responsive
carousels, category filters, and accessible dialogs where they genuinely
improve the experience.

------------------------------------------------------------------------

## 10. Mobile-First Responsive Design

Most bakery customers are likely to browse from mobile devices.

Mobile usability is therefore a major priority.

Test the website on:

-   Small mobile screens.
-   Standard smartphones.
-   Large smartphones.
-   Tablets.
-   Laptops.
-   Desktop monitors.

Ensure:

-   Navigation works correctly.
-   Product grids adapt naturally.
-   Images retain their proper proportions.
-   Text remains readable.
-   WhatsApp buttons are easy to access.
-   Modals fit within the viewport.
-   Forms are simple to complete.
-   Touch targets are sufficiently large.
-   No horizontal overflow exists.

Do not merely shrink the desktop layout.

Design the mobile experience deliberately.

------------------------------------------------------------------------

## 11. SEO, Performance, and Accessibility

Implement modern website best practices.

### SEO

-   Page-specific metadata.
-   Appropriate title and description tags.
-   Open Graph metadata.
-   Canonical URLs where relevant.
-   Semantic headings.
-   Descriptive image alt text.
-   Clean, readable URLs.
-   Sitemap.
-   Robots configuration.
-   Appropriate structured data when supported by real business
    information.

### Performance

-   Use Next.js image optimization.
-   Lazy-load below-the-fold images.
-   Optimize image dimensions.
-   Avoid unnecessary JavaScript.
-   Minimize layout shifts.
-   Use caching appropriately.
-   Optimize database queries.
-   Avoid loading every gallery image at once.

### Accessibility

-   Semantic HTML.
-   Keyboard navigation.
-   Accessible dialogs.
-   Proper form labels.
-   Clear focus states.
-   Sufficient color contrast.
-   Accessible icon buttons.
-   Reduced-motion support.

Target excellent Lighthouse performance and accessibility scores while
prioritizing a beautiful visual experience.

------------------------------------------------------------------------

## 12. Suggested Website Structure

Use a clean and maintainable project structure.

Suggested routes:

**Public website**

-   `/`
-   `/cakes`
-   `/cakes/[slug]`
-   `/menu`
-   `/menu/[slug]`
-   `/gallery`
-   `/about`
-   `/contact`
-   `/privacy`
-   `/terms`

**Admin**

-   `/admin/login`
-   `/admin`
-   `/admin/categories`
-   `/admin/products`
-   `/admin/gallery`
-   `/admin/homepage`
-   `/admin/reviews`
-   `/admin/media`
-   `/admin/settings`

Use reusable components for:

-   Navbar.
-   Footer.
-   Hero.
-   Category cards.
-   Product cards.
-   Gallery.
-   Product modal.
-   WhatsApp buttons.
-   Forms.
-   Admin tables.
-   Upload interfaces.
-   Confirmation dialogs.
-   Toast notifications.

Maintain a clear separation between frontend presentation, data access,
validation, and business logic.

------------------------------------------------------------------------

## 13. Important Business Rules

Follow these requirements throughout development.

1.  **WhatsApp is the primary ordering channel.** Do not build a
    checkout or online payment system unless explicitly requested later.
2.  **Every product must have a recognizable reference.** WhatsApp
    messages must contain the selected item's name and its actual
    reference link.
3.  **Custom cakes are the main business focus.** Give them the
    strongest visual presence on the homepage and in navigation.
4.  **Other bakery products must remain accessible.** Cupcakes,
    brownies, mousse, cookies, tea snacks, and other configured
    categories should have their own organized sections.
5.  **The owner controls the content.** Categories, products, images,
    homepage sections, and settings must be editable from the admin
    dashboard.
6.  **The brand identity comes first.** Base colors, logo usage,
    typography, and photography style on the actual UMBAKES Instagram
    references.
7.  **Do not invent real business information.** Keep unknown phone
    numbers, addresses, opening hours, prices, reviews, and other
    details configurable or unpublished until supplied.
8.  **Keep the interface simple.** Both customers and the bakery owner
    should be able to understand how the website works without technical
    knowledge.
9.  **Do not overcomplicate the architecture.** Implement features that
    directly serve the bakery's actual needs.
10. **Build for production.** Pay attention to security, error handling,
    database integrity, responsiveness, and maintainability.

------------------------------------------------------------------------

## 14. Development Workflow: Inspect, Plan, Implement, Test, and Audit

Follow this workflow strictly.

### Phase 1: Inspect

Before changing anything:

-   Inspect the existing repository.
-   Review the current framework and dependencies.
-   Identify existing reusable components.
-   Inspect the available assets.
-   Check environment configuration.
-   Review existing database structure, if any.
-   Identify missing information and integration requirements.

If this is a new project, establish a clean foundation.

If Instagram cannot be accessed, clearly identify which assets and
business details are missing.

### Phase 2: Plan

Create a practical development plan.

Include:

-   Project architecture.
-   Frontend page structure.
-   Component design.
-   Database schema.
-   Admin dashboard structure.
-   WhatsApp ordering flow.
-   Media storage strategy.
-   Authentication strategy.
-   Design system.
-   Implementation phases.
-   Testing approach.

Identify significant architectural decisions before implementation.

Do not make unnecessary architectural changes without explaining their
impact.

### Phase 3: Design

Develop the visual system based on the actual brand references.

Establish:

-   Brand colors.
-   Typography.
-   Spacing.
-   Image treatments.
-   Buttons.
-   Cards.
-   Navigation.
-   Modal styling.
-   Admin dashboard design.

Prioritize the homepage and cake gallery before less important sections.

Create a consistent design language across the public website and admin
panel.

### Phase 4: Implement

Build the application in logical stages:

1.  Project setup and database.
2.  Brand theme and shared components.
3.  Public homepage.
4.  Cake gallery and category pages.
5.  Product details.
6.  WhatsApp ordering.
7.  Admin authentication.
8.  Category management.
9.  Product management.
10. Gallery and media management.
11. Homepage editor.
12. Website settings.
13. Reviews and Instagram section.
14. SEO and optimization.
15. Final responsive and accessibility improvements.

Make sure every major feature is functional, not just visually
represented.

### Phase 5: Test

Run the appropriate checks:

-   TypeScript type-checking.
-   ESLint.
-   Production build.
-   Database migration checks.
-   API validation tests.
-   Authentication and authorization checks.
-   Product CRUD tests.
-   Category CRUD tests.
-   Media upload tests.
-   WhatsApp URL and message tests.
-   Mobile responsiveness checks.
-   Accessibility checks.
-   Basic performance checks.

Test real customer workflows, not only isolated components.

### Phase 6: Final Audit

Conduct a complete final audit.

Verify:

-   All pages load correctly.
-   All navigation links work.
-   All product categories display the right items.
-   Cake images open correctly.
-   Modals behave correctly.
-   WhatsApp messages contain the correct product reference.
-   Admin changes update the public website.
-   Images upload and render properly.
-   Hidden sections remain hidden.
-   Unauthorized users cannot access admin features.
-   The layout works across screen sizes.
-   No major console errors exist.
-   There are no broken images or dead buttons.
-   Database relations and deletion behavior are correct.
-   The production build succeeds.

Fix discovered issues and rerun relevant checks.

Do not report a feature as complete if it is only a placeholder.

------------------------------------------------------------------------

## 15. Final Expected Result

The final product should be a complete, premium, visually attractive
bakery website for UMBAKES.

A visitor should be able to:

-   Understand the brand immediately.
-   Explore beautiful custom cake designs.
-   Browse birthday, wedding, bridal, and other occasion cakes.
-   Explore cupcakes, brownies, mousse, cookies, tea snacks, and other
    menu items.
-   Open large images and view product details.
-   Select a product and order through WhatsApp.
-   Send a custom cake inquiry with their own requirements.
-   Discover the bakery's story and social media profile.
-   Use the website easily on mobile.

The bakery owner should be able to:

-   Log in securely.
-   Manage categories.
-   Add and edit cake designs.
-   Manage bakery products.
-   Upload and replace images.
-   Control homepage sections.
-   Change homepage images and text.
-   Manage reviews.
-   Update WhatsApp contact details.
-   Manage Instagram links and other settings.
-   Keep the website content updated without writing code.

**The most important design principle:**

Make UMBAKES look like a premium custom cake studio with a beautiful
visual portfolio and a very simple WhatsApp ordering experience.

The homepage should immediately draw attention to the cakes. Every other
feature should support that primary goal without making the website feel
crowded or complicated.

Start by inspecting the project and the available brand assets. Then
prepare the implementation plan and proceed through the development
workflow, validating each stage before moving to the next.
