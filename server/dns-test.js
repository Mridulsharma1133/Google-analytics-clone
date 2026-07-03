import dns from "dns/promises";

try {
  const result = await dns.resolveSrv(
    "_mongodb._tcp.cluster0.0z2hufx.mongodb.net"
  );
  console.log(result);
} catch (err) {
  console.error(err);
}