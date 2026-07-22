// Downscale + re-encode the GLB's embedded textures.
// PNG 4096² -> JPEG 2048² (image/jpeg is core glTF 2.0, no extension needed).
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = process.argv[2];
const DST = process.argv[3];
const SIZE = parseInt(process.argv[4] || "2048", 10);

function align4(n) {
  return (n + 3) & ~3;
}

async function main() {
  const buf = fs.readFileSync(SRC);
  const magic = buf.toString("ascii", 0, 4);
  if (magic !== "glTF") throw new Error("not a GLB");

  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.toString("utf8", 20, 20 + jsonLen));
  const binHeaderOff = 20 + jsonLen;
  const binLen = buf.readUInt32LE(binHeaderOff);
  const binStart = binHeaderOff + 8;
  const bin = buf.subarray(binStart, binStart + binLen);

  // Re-encode each image
  const newImageData = new Map(); // bufferView index -> Buffer
  for (const [i, img] of json.images.entries()) {
    if (img.bufferView === undefined) continue;
    const bv = json.bufferViews[img.bufferView];
    const off = bv.byteOffset || 0;
    const src = bin.subarray(off, off + bv.byteLength);

    const isNormal = /normal/i.test(img.name || "");
    const quality = isNormal ? 94 : 90;

    const out = await sharp(src)
      .resize(SIZE, SIZE, { fit: "fill", kernel: "lanczos3" })
      .jpeg({ quality, chromaSubsampling: "4:4:4", mozjpeg: true })
      .toBuffer();

    console.log(
      `  image ${i} ${img.name}: ${(bv.byteLength / 1e6).toFixed(1)}MB PNG -> ` +
        `${(out.length / 1e6).toFixed(2)}MB JPEG q${quality}`
    );
    newImageData.set(img.bufferView, out);
    img.mimeType = "image/jpeg";
  }

  // Rebuild the binary chunk, keeping bufferView order, 4-byte aligned
  const chunks = [];
  let cursor = 0;
  json.bufferViews.forEach((bv, idx) => {
    const replacement = newImageData.get(idx);
    const data = replacement
      ? replacement
      : bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);

    const pad = align4(cursor) - cursor;
    if (pad) chunks.push(Buffer.alloc(pad));
    cursor += pad;

    bv.byteOffset = cursor;
    bv.byteLength = data.length;
    chunks.push(data);
    cursor += data.length;
  });

  const padEnd = align4(cursor) - cursor;
  if (padEnd) chunks.push(Buffer.alloc(padEnd));
  const newBin = Buffer.concat(chunks);
  json.buffers[0].byteLength = newBin.length;

  let jsonStr = JSON.stringify(json);
  while (jsonStr.length % 4 !== 0) jsonStr += " ";
  const jsonBuf = Buffer.from(jsonStr, "utf8");

  const total = 12 + 8 + jsonBuf.length + 8 + newBin.length;
  const out = Buffer.alloc(total);
  let p = 0;
  out.write("glTF", p, "ascii"); p += 4;
  out.writeUInt32LE(2, p); p += 4;
  out.writeUInt32LE(total, p); p += 4;
  out.writeUInt32LE(jsonBuf.length, p); p += 4;
  out.write("JSON", p, "ascii"); p += 4;
  jsonBuf.copy(out, p); p += jsonBuf.length;
  out.writeUInt32LE(newBin.length, p); p += 4;
  out.write("BIN\0", p, "ascii"); p += 4;
  newBin.copy(out, p);

  fs.writeFileSync(DST, out);
  console.log(
    `\n${path.basename(SRC)} ${(buf.length / 1e6).toFixed(1)}MB -> ` +
      `${path.basename(DST)} ${(out.length / 1e6).toFixed(1)}MB`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
