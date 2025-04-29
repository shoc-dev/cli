#!/bin/sh

echo "===== Host Information ====="
echo "Hostname: $(uname -n)"
echo "Operating System: $(uname -s) $(uname -r)"
echo "Architecture: $(uname -m)"

# CPU Info (basic, Alpine doesn't have lscpu by default)
echo "===== CPU Information ====="
echo "CPU(s): $(getconf _NPROCESSORS_ONLN)"

# Memory Info from /proc
echo "===== Memory Information ====="
grep -E 'MemTotal|MemFree|MemAvailable' /proc/meminfo

# Disk Usage
echo "===== Disk Usage ====="
df -h /

# Uptime (approximate fallback)
echo "===== Uptime ====="
if [ -r /proc/uptime ]; then
    awk '{print "Uptime (seconds): " $1}' /proc/uptime
else
    echo "Uptime info not available"
fi
