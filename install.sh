
googleMapsApiKey="XXXXXXXXXXXXXXXXXXXX"
if [ "$1" ]
then
  googleMapsApiKey=$1
fi

lavaca_application_src="../src/www/"

copy_file() {
  if [ -e "${2}${3}" ] && [ -d "${lavaca_application_src}" ]
  then
    echo "Skipped file $file_name - File already exists"
  else
    mkdir -p "${2}"
    cp "${1}${3}" "${2}${3}"
  fi
}

#copy styles
copy_file "./application-src/css/" "${lavaca_application_src}css/views/" "GoogleMapsView.less"
copy_file "./application-src/css/" "${lavaca_application_src}css/views/" "MapView.less"

#copy images
copy_file "./application-src/img/" "${lavaca_application_src}assets/img/" "marker-cluster1@2x.png"
copy_file "./application-src/img/" "${lavaca_application_src}assets/img/" "marker-cluster2@2x.png"
copy_file "./application-src/img/" "${lavaca_application_src}assets/img/" "marker-cluster3@2x.png"
copy_file "./application-src/img/" "${lavaca_application_src}assets/img/" "marker-cluster4@2x.png"
copy_file "./application-src/img/" "${lavaca_application_src}assets/img/" "marker-cluster5@2x.png"
copy_file "./application-src/img/" "${lavaca_application_src}assets/img/" "marker-current@2x.png"
copy_file "./application-src/img/" "${lavaca_application_src}assets/img/" "marker@2x.png"
copy_file "./application-src/img/" "${lavaca_application_src}assets/img/" "map-placeholder.jpg"

#copy js
copy_file "./application-src/js/" "${lavaca_application_src}js/app/ui/views/" "GoogleMapsAppView.js"
copy_file "./application-src/js/" "${lavaca_application_src}js/app/ui/views/" "MapView.js"
copy_file "./application-src/js/" "${lavaca_application_src}js/app/models/" "GoogleMapsAppModel.js"

#copy template
copy_file "./application-src/templates/" "${lavaca_application_src}js/templates/" "GoogleMapsView.html"
copy_file "./application-src/templates/" "${lavaca_application_src}js/templates/" "MapView.html"