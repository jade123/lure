import AppKit
import AVFoundation
import Foundation

guard CommandLine.arguments.count == 3 else {
  FileHandle.standardError.write(Data("用法：extract-video-frame.swift <视频> <封面.jpg>\n".utf8))
  exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let asset = AVURLAsset(url: inputURL)
let duration = CMTimeGetSeconds(asset.duration)
let requestedSecond = duration.isFinite && duration > 0 ? min(2, max(0, duration * 0.08)) : 0

let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: 1280, height: 1280)
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = CMTime(seconds: 0.5, preferredTimescale: 600)

do {
  let image = try generator.copyCGImage(
    at: CMTime(seconds: requestedSecond, preferredTimescale: 600),
    actualTime: nil
  )
  let bitmap = NSBitmapImageRep(cgImage: image)
  guard let jpeg = bitmap.representation(
    using: .jpeg,
    properties: [.compressionFactor: 0.78]
  ) else {
    throw NSError(domain: "LurePoster", code: 2, userInfo: [
      NSLocalizedDescriptionKey: "无法编码 JPEG"
    ])
  }
  try jpeg.write(to: outputURL, options: .atomic)
  print("已生成：\(outputURL.lastPathComponent)")
} catch {
  FileHandle.standardError.write(Data("封面生成失败：\(error.localizedDescription)\n".utf8))
  exit(1)
}
