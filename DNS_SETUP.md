
# DNS Configuration for kruthika.fun

## SPF Record Setup

Add the following TXT record to your DNS settings:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

This SPF record will:
- Prevent email spoofing
- Improve email deliverability
- Protect your domain reputation

## How to Add:
1. Log in to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare)
2. Navigate to DNS Management
3. Add a new TXT record with the values above
4. Save and wait for DNS propagation (up to 24 hours)

## Verification:
Test your SPF record at: https://mxtoolbox.com/spf.aspx
