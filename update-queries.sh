#!/bin/bash
# Quick fix for backend queries to match new schema

cd backend/queries

# Backup original files
cp profileQueries.js profileQueries.js.backup
cp projectQueries.js projectQueries.js.backup

# Update profileQueries.js
sed -i '' 's/p\.id,/p.profile_id,/g' profileQueries.js
sed -i '' 's/u\.id/u.user_id/g' profileQueries.js  
sed -i '' 's/u\.name/u.first_name || '\'' '\'' || u.last_name as name/g' profileQueries.js
sed -i '' 's/profileId/profile_id/g' profileQueries.js

# Update projectQueries.js  
sed -i '' 's/p\.id,/p.project_id,/g' projectQueries.js
sed -i '' 's/project_id INTEGER/project_id INTEGER/g' projectQueries.js
sed -i '' 's/profile_id INTEGER/profile_id INTEGER/g' projectQueries.js

echo "✓ Queries updated!"
