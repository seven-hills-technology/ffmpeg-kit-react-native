require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platform          = :ios
  s.requires_arc      = true
  s.static_framework  = true

  s.source       = { :git => "https://github.com/lufinkey/ffmpreg-kit-react-native.git", :tag => "react.native.v#{s.version}" }

  s.default_subspec = 'https'

  s.dependency "React-Core"

  s.prepare_command = <<-CMD
    >&2 echo "performing prepare_command for pod ${POD_NAME}"
    rm -rf ios/libs || exit $?
    if grep -q 'ffmpeg-kit-react-native/https+x264' "${PODS_ROOT}/../Podfile.lock"; then
      unzip 'ios/ffmpeg-kit-ios-https+x264.zip' -d ios/libs || exit $?
    else
      unzip 'ios/ffmpeg-kit-ios-https.zip' -d ios/libs || exit $?
    fi
  CMD

  s.source_files = '**/FFmpegKitReactNativeModule.m',
          '**/FFmpegKitReactNativeModule.h'
  s.vendored_frameworks = "ios/libs/*.{xcframework}"
  s.ios.deployment_target = '12.1'

  s.subspec 'https' do |ss|
  end

  s.subspec 'https+x264' do |ss|
  end
end
