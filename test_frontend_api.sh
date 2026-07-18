#!/usr/bin/env bash

echo "Simulating frontend API calls..."
echo ""

# Simulate exactly what the frontend does
echo "1. Simulating listBusinesses (published=true, sort=-fundingRaised,-created, expand=owner):"
curl -s "https://api.brick-fund.com/api/collections/businesses/records?filter=published%20%3D%20true&sort=-fundingRaised%2C-created&expand=owner&perPage=12" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Status: {data[\"totalItems\"]} businesses found'); print(f'Page {data[\"page\"]} of {data[\"totalPages\"]}'); [print(f'  - {b[\"name\"]}: €{b[\"fundingRaised\"]:,}/{b[\"fundingGoal\"]:,}') for b in data['items'][:3]]"
echo ""

echo "2. Simulating listCities (fields=city,country):"
curl -s "https://api.brick-fund.com/api/collections/businesses/records?filter=published%20%3D%20true&fields=city%2Ccountry&perPage=100" | python3 -c "import sys, json; data=json.load(sys.stdin); cities = set(); [cities.add(b['city']) for b in data['items'] if b.get('city')]; print(f'Found {len(cities)} unique cities: {sorted(cities)}')"
echo ""

echo "3. Testing with search filter:"
curl -s "https://api.brick-fund.com/api/collections/businesses/records?filter=published%20%3D%20true%20%26%26%20name%20~%20%22Porto%22" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Found {data[\"totalItems\"]} Porto businesses'); [print(f'  - {b[\"name\"]}') for b in data['items']]"
echo ""

echo "4. Testing with city filter:"
curl -s "https://api.brick-fund.com/api/collections/businesses/records?filter=published%20%3D%20true%20%26%26%20city%20%3D%20%22Lisbon%22" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Found {data[\"totalItems\"]} Lisbon businesses'); [print(f'  - {b[\"name\"]}') for b in data['items']]"
echo ""

echo "Frontend API simulation complete!"