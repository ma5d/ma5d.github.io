cd build
git init
git add .
git commit -m "build"
git branch -M build
git remote add origin https://github.com/horse-world/horse-world.github.io.git
git push -f -u origin build
cd ..
echo https://horse-world.github.io
