
# Supabase Setup Guide

This guide will help you set up your Supabase project for the SafetySpot hazard reporting application.

## Tables and Schema

The application uses the following tables:

1. **profiles** - User profile information
2. **hazard_reports** - Reported hazards information
3. **hazard_votes** - User votes on hazards
4. **hazard_comments** - User comments on hazards

## Setup Instructions

1. Go to your Supabase dashboard: [https://app.supabase.com/](https://app.supabase.com/)
2. Select your project
3. Navigate to the SQL Editor
4. Copy the contents of `schema.sql` in this folder
5. Run the SQL query to create all the necessary tables, functions, triggers and RLS policies

## Storage Setup

The schema automatically creates a storage bucket named `hazard-images` for storing hazard images. Make sure to set appropriate CORS and security settings in the Supabase dashboard if needed.

## Authentication

The application uses Supabase Authentication. Make sure to enable the Email/Password sign-in method in your Supabase dashboard.

## Row Level Security (RLS)

The schema includes RLS policies to secure your data:

- Profiles are publicly viewable but can only be updated by their owners
- Hazard reports are publicly viewable but can only be created by authenticated users and updated by their creators
- Votes and comments are publicly viewable but can only be created by authenticated users and deleted by their creators

## Environment Variables

Make sure to set the following environment variables in your project:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase dashboard under Project Settings > API.
