cd build
git init
git add .
git commit -m "build"
git branch -M build
git remote add origin https://github.com/ma5d/ma5d.github.io.git
git push -f -u origin build
cd ..
echo https://ma5d.github.io
