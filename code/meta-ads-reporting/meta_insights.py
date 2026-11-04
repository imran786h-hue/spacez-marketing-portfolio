#!/usr/bin/env python3
"""Pull Meta Ads spend and results by campaign for one ad account.

Usage:
  python3 meta_insights.py                      # last full Monday to Sunday week
  python3 meta_insights.py 2026-10-12 2026-10-18
  python3 meta_insights.py --check              # verify token and account access only

Reads META_ACCESS_TOKEN, META_AD_ACCOUNT_ID and META_API_VERSION from the
environment, or from a .env file next to this script (see .env.example).
Uses a system user token with read access only. Standard library only.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
KEYS = ("META_ACCESS_TOKEN", "META_AD_ACCOUNT_ID", "META_API_VERSION")


def load_env():
    env = {}
    path = os.path.join(HERE, ".env")
    if os.path.exists(path):
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip()
    for k in KEYS:
        if os.environ.get(k):
            env[k] = os.environ[k]
    missing = [k for k in KEYS if not env.get(k)]
    if missing:
        sys.exit("Missing settings: " + ", ".join(missing))
    return env


def get(url, params):
    full = url + "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(full, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Meta API error {e.code}: {e.read().decode()}")


def main():
    env = load_env()
    token = env["META_ACCESS_TOKEN"]
    base = f"https://graph.facebook.com/{env['META_API_VERSION']}/{env['META_AD_ACCOUNT_ID']}"

    if "--check" in sys.argv:
        info = get(base, {"fields": "name,account_status,currency,timezone_name", "access_token": token})
        print(json.dumps(info, indent=2))
        return

    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) == 2:
        since, until = args
    else:
        today = date.today()
        monday = today - timedelta(days=today.weekday() + 7)
        since, until = monday.isoformat(), (monday + timedelta(days=6)).isoformat()

    params = {
        "level": "campaign",
        "fields": "campaign_name,campaign_id,spend,impressions,clicks,actions,cost_per_action_type",
        "time_range": json.dumps({"since": since, "until": until}),
        "limit": 200,
        "access_token": token,
    }
    rows = get(base + "/insights", params).get("data", [])
    print(f"Meta Ads  {since} to {until}\n")
    total = 0.0
    for r in sorted(rows, key=lambda x: -float(x.get("spend", 0))):
        spend = float(r.get("spend", 0))
        total += spend
        actions = {a["action_type"]: a["value"] for a in r.get("actions", [])}
        top = ", ".join(f"{k}={v}" for k, v in list(actions.items())[:4]) or "no actions"
        print(f"{r['campaign_name']} | spend {spend:.2f} | clicks {r.get('clicks')} | {top}")
    print(f"\nTotal spend: {total:.2f}  (campaigns: {len(rows)})")


if __name__ == "__main__":
    main()
