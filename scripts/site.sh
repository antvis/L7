
if [ -d "./site_temp" ]; then
  rm -rf ./site_temp
fi

mkdir ./site_temp
cd ./site_temp

git clone  https://code.alipay.com/datavis/l7-site.git --depth=1


rsync --exclude packages/site/node_modules  -r packages/site ./temp 


rm -rf ./temp/site

rsync -av  --exclude .dumi/tmp  --exclude node_modules --exclude public  packages/site ./site_temp/l7-site