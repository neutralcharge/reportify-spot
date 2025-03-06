
# Supabase Setup Guide

This guide will help you set up your Supabase project for the SafetySpot hazard reporting application.

## Tables and Schema

The application uses the following tables:

1. **profiles** - User profile information
2. **hazard_reports** - Reported hazards information
3. **hazard_votes** - User votes on hazards
4. **hazard_comments** - User comments on hazards

## Setup Information

The application is connected to the following Supabase instance:

- **URL**: https://rfgtryzdddjglrpzlxql.supabase.co
- **API Key**: An anonymous key has been configured in the application

## Storage Setup

The schema automatically creates a storage bucket named `hazard-images` for storing hazard images. Make sure to set appropriate CORS and security settings in the Supabase dashboard if needed.

## Authentication

The application uses Supabase Authentication. Make sure to enable the Email/Password sign-in method in your Supabase dashboard.

## Row Level Security (RLS)

The schema includes RLS policies to secure your data:

- Profiles are publicly viewable but can only be updated by their owners
- Hazard reports are publicly viewable but can only be created by authenticated users and updated by their creators
- Votes and comments are publicly viewable but can only be created by authenticated users and deleted by their creators

## Important Notes

All the tables, triggers, functions, and RLS policies have been created according to the schema defined in `schema.sql`. The application is now ready to use with your Supabase instance.
