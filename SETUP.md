# Deployment Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Resend API Configuration
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key_here

# Contact Email
CONTACT_EMAIL=tatepark@gse.harvard.edu
```

## Resend Setup

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your email
3. Create an API key in the dashboard
4. Add the API key to your `.env.local` file
5. For production, add the environment variables to Vercel

## Local Development

```bash
# Install dependencies
npm install

# Add your .env.local file with the variables above

# Run the development server
npm run dev
```

## Vercel Deployment

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import the `grounds-marketing` repository
3. Add environment variables in Vercel project settings:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
4. Deploy!

## Testing Email Forms

- Contact form: Test at the "Get in contact" button
- Waitlist form: Test at the "Join our waitlist" buttons

Both forms will send emails to the `CONTACT_EMAIL` address.

