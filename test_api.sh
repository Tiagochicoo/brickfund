#!/usr/bin/env bash

echo "Testing PocketBase API connectivity..."
echo ""

# Test basic API health
echo "1. Testing API health endpoint:"
curl -s https://api.brick-fund.com/api/health | python3 -m json.tool
echo ""

# Test businesses collection
echo "2. Testing businesses collection:"
curl -s "https://api.brick-fund.com/api/collections/businesses/records?filter=published%20%3D%20true&perPage=3" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Found {len(data[\"items\"])} published businesses'); [print(f'  - {b[\"name\"]} ({b[\"location\"]})') for b in data['items']]"
echo ""

# Test users collection (should return empty or auth error)
echo "3. Testing users collection (no auth):"
curl -s "https://api.brick-fund.com/api/collections/users/records?perPage=3" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Status: {data.get(\"totalItems\", 0)} users accessible')"
echo ""

# Test CORS with proper headers
echo "4. Testing CORS with Origin header:"
curl -s -X OPTIONS "https://api.brick-fund.com/api/collections/businesses/records" \
  -H "Origin: https://brick-fund.com" \
  -H "Access-Control-Request-Method: GET" \
  -I | grep -i "access-control"
echo ""

# Test actual fetch with CORS headers
echo "5. Testing actual GET with CORS headers:"
curl -s "https://api.brick-fund.com/api/collections/businesses/records?filter=published%20%3D%20true&perPage=1" \
  -H "Origin: https://brick-fund.com" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Got {len(data[\"items\"])} items')"
echo ""

echo "API connectivity tests complete!"