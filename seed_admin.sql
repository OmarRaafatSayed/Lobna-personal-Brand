-- Run this AFTER running supabase_setup.sql
-- Creates admin user: admin@lobna.com / Admin@123456

insert into users (email, password, role)
values (
  'admin@lobna.com',
  '$2a$12$sQ1wmfQw3FoKIkw9CNQ7XulGnXEV5urG7.ePMxhDUZUUuEUdm.Zsa',
  'admin'
)
on conflict (email) do nothing;
