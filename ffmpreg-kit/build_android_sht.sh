#!/bin/bash
export ANDROID_SDK_ROOT=~/Library/Android/sdk
export ANDROID_NDK_ROOT="$ANDROID_SDK_ROOT/ndk/29.0.13113456"
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk17/Contents/Home
./android.sh --enable-android-media-codec --enable-android-zlib --disable-arm-v7a --enable-x264 --enable-gpl --speed || exit $?
