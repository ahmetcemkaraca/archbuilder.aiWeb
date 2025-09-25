# Pull Request - ArchBuilder.AI Website

## 📋 Description
<!-- Provide a clear and concise description of what this PR accomplishes -->

## 🔗 Related Issue
<!-- Link to the related issue -->
Closes #

## 🤖 Copilot Implementation Checklist
<!-- For Copilot-generated PRs, verify all requirements -->

### Architecture Compliance
- [ ] Followed Next.js 15 + TypeScript + static export architecture
- [ ] Used custom i18n context system (NOT next-intl)
- [ ] Applied Tailwind CSS 4 styling patterns
- [ ] Maintained performance target (Lighthouse ≥90)

### Code Quality
- [ ] All UI text uses i18n system (no hardcoded strings)
- [ ] TypeScript strict mode compliance
- [ ] ESLint passes without errors/warnings
- [ ] Prettier formatting applied
- [ ] Responsive design (mobile + desktop tested)
- [ ] Dark/light theme compatibility verified

### Documentation & Registry
- [ ] Updated `docs/registry/identifiers.json` for new exports/components
- [ ] Updated `docs/registry/schemas.json` for new data models
- [ ] Translation keys added to all 7 locale files (`src/lib/i18n/locales/*.ts`)
- [ ] Component follows existing patterns in appropriate directory

### Testing & Validation
- [ ] Build process (`npm run build`) succeeds
- [ ] Static export generation works
- [ ] Manual testing completed (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness verified
- [ ] No console errors or warnings

## 🛠️ Type of Change
<!-- Mark the relevant option -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI update (changes that don't affect functionality)
- [ ] ⚡ Performance improvement
- [ ] 🌐 i18n/Translation update

## 📱 Screenshots & Testing Evidence
<!-- Include screenshots of changes, especially for UI updates -->

### Desktop
<!-- Screenshot of desktop view -->

### Mobile
<!-- Screenshot of mobile view -->

### Performance
<!-- Include Lighthouse scores or performance metrics if relevant -->

## 🌍 i18n Verification
<!-- Verify internationalization implementation -->

- [ ] English (en) - Primary language
- [ ] Turkish (tr) - Secondary language
- [ ] Russian (ru)
- [ ] German (de)
- [ ] French (fr)
- [ ] Spanish (es)
- [ ] Italian (it)

## 🧪 Testing Instructions
<!-- How should reviewers test this change? -->

1. **Setup:**
   ```bash
   npm install --legacy-peer-deps
   npm run build
   ```

2. **Testing Steps:**
   <!-- Provide specific steps to test the changes -->

3. **Expected Results:**
   <!-- What should reviewers expect to see? -->

## 📖 Additional Context
<!-- Add any other context about the PR here -->

### Files Changed
<!-- Automatically filled by PR, but highlight key changes -->

### Dependencies
<!-- List any new dependencies added -->

### Performance Impact
<!-- Describe any performance implications -->

### Breaking Changes
<!-- Describe any breaking changes and migration path -->

---

## 📋 Review Checklist (for Maintainers)
<!-- Internal checklist for maintainers -->

- [ ] Code follows ArchBuilder.AI website patterns
- [ ] Performance impact assessed
- [ ] Security implications reviewed
- [ ] Browser compatibility verified
- [ ] Documentation updated appropriately
- [ ] Changes align with project goals