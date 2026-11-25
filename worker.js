// LGNS OTC 完整可替换 Worker，已恢复缩进和换行。
// 基于用户上传的 worker(3).js，仅加入领先价差回调及相关说明。
// 搜索 lgnsShouldReprice 可找到新增业务逻辑；文件包含原有 ethers 依赖。
// 源文件 SHA256: cc0ccae320a01cf48697ab0c8b3daf05f4532103458cb956f48477a334fd7568

/**
 * 自动跟价和领先回调，共用 autoFollow 开关。
 * 被有效大额对手超越时，沿用原有竞争报价逻辑。
 * 已经领先时：卖单向上回调，买单向下回调。
 * 报价改善金额 = 单枚改善价格 × 订单剩余 LGNS。
 * 改善金额须达到 3 笔 Gas 上限 + 最低净差价才允许回调。
 * 价格边界、净差价、冷却、每日预算、待确认和账本检查仍在原流程生效。
 * 金额单位：18 位 DAI；数量单位：9 位 LGNS。
 */
function lgnsShouldReprice({ enabled, lostLead, sell, currentPrice, targetPrice, remainingQty, gasPerTx, minimumNetProfit }) {
  if (!enabled || targetPrice === null || targetPrice === currentPrice) return false;
  if (lostLead) return true;
  if (remainingQty <= 0n) return false;
  const betterPrice = sell ? targetPrice > currentPrice : targetPrice < currentPrice;
  if (!betterPrice) return false;
  const priceImprovement = sell ? targetPrice - currentPrice : currentPrice - targetPrice;
  const improvementDAI = priceImprovement * remainingQty / 1000000000n;
  const repriceGasBudget = 3n * gasPerTx;
  return improvementDAI >= repriceGasBudget + minimumNetProfit;
}
var ac = Object.defineProperty;
var oc = (n31, e) => {
  for (var t in e) ac(n31, t, { get: e[t], enumerable: true });
};
import { DurableObject as kd } from "cloudflare:workers";
var Fr = "6.17.0";
function cc(n31, e, t) {
  let r = e.split("|").map((i) => i.trim());
  for (let i = 0; i < r.length; i++) switch (e) {
    case "any":
      return;
    case "bigint":
    case "boolean":
    case "number":
    case "string":
      if (typeof n31 === e) return;
  }
  let s = new Error(`invalid value for type ${e}`);
  throw s.code = "INVALID_ARGUMENT", s.argument = `value.${t}`, s.value = n31, s;
}
async function Ft(n31) {
  let e = Object.keys(n31);
  return (await Promise.all(e.map((r) => Promise.resolve(n31[r])))).reduce((r, s, i) => (r[e[i]] = s, r), {});
}
function R(n31, e, t) {
  for (let r in e) {
    let s = e[r], i = t ? t[r] : null;
    i && cc(s, i, r), Object.defineProperty(n31, r, { enumerable: true, value: s, writable: false });
  }
}
function On(n31, e) {
  if (n31 == null) return "null";
  if (e == null && (e = /* @__PURE__ */ new Set()), typeof n31 == "object") {
    if (e.has(n31)) return "[Circular]";
    e.add(n31);
  }
  if (Array.isArray(n31)) return "[ " + n31.map((t) => On(t, e)).join(", ") + " ]";
  if (n31 instanceof Uint8Array) {
    let t = "0123456789abcdef", r = "0x";
    for (let s = 0; s < n31.length; s++) r += t[n31[s] >> 4], r += t[n31[s] & 15];
    return r;
  }
  if (typeof n31 == "object" && typeof n31.toJSON == "function") return On(n31.toJSON(), e);
  switch (typeof n31) {
    case "boolean":
    case "number":
    case "symbol":
      return n31.toString();
    case "bigint":
      return BigInt(n31).toString();
    case "string":
      return JSON.stringify(n31);
    case "object": {
      let t = Object.keys(n31);
      return t.sort(), "{ " + t.map((r) => `${On(r, e)}: ${On(n31[r], e)}`).join(", ") + " }";
    }
  }
  return "[ COULD NOT SERIALIZE ]";
}
function Cn(n31, e) {
  return n31 && n31.code === e;
}
function Ln(n31, e, t) {
  let r = n31;
  {
    let i = [];
    if (t) {
      if ("message" in t || "code" in t || "name" in t) throw new Error(`value will overwrite populated values: ${On(t)}`);
      for (let a in t) {
        if (a === "shortMessage") continue;
        let o = t[a];
        i.push(a + "=" + On(o));
      }
    }
    i.push(`code=${e}`), i.push(`version=${Fr}`), i.length && (n31 += " (" + i.join(", ") + ")");
  }
  let s;
  switch (e) {
    case "INVALID_ARGUMENT":
      s = new TypeError(n31);
      break;
    case "NUMERIC_FAULT":
    case "BUFFER_OVERRUN":
      s = new RangeError(n31);
      break;
    default:
      s = new Error(n31);
  }
  return R(s, { code: e }), t && Object.assign(s, t), s.shortMessage == null && R(s, { shortMessage: r }), s;
}
function k(n31, e, t, r) {
  if (!n31) throw Ln(e, t, r);
}
function u(n31, e, t, r) {
  k(n31, e, "INVALID_ARGUMENT", { argument: t, value: r });
}
function Un(n31, e, t) {
  t == null && (t = ""), t && (t = ": " + t), k(n31 >= e, "missing argument" + t, "MISSING_ARGUMENT", { count: n31, expectedCount: e }), k(n31 <= e, "too many arguments" + t, "UNEXPECTED_ARGUMENT", { count: n31, expectedCount: e });
}
var fc = ["NFD", "NFC", "NFKD", "NFKC"].reduce((n31, e) => {
  try {
    if ("test".normalize(e) !== "test") throw new Error("bad");
    if (e === "NFD" && "é".normalize("NFD") !== "é") throw new Error("broken");
    n31.push(e);
  } catch {
  }
  return n31;
}, []);
function Dn(n31) {
  k(fc.indexOf(n31) >= 0, "platform missing String.prototype.normalize", "UNSUPPORTED_OPERATION", { operation: "String.prototype.normalize", info: { form: n31 } });
}
function Ae(n31, e, t) {
  if (t == null && (t = ""), n31 !== e) {
    let r = t, s = "new";
    t && (r += ".", s += " " + t), k(false, `private constructor; use ${r}from* methods`, "UNSUPPORTED_OPERATION", { operation: s });
  }
}
function xa(n31, e, t) {
  if (n31 instanceof Uint8Array) return t ? new Uint8Array(n31) : n31;
  if (typeof n31 == "string" && n31.length % 2 === 0 && n31.match(/^0x[0-9a-f]*$/i)) {
    let r = new Uint8Array((n31.length - 2) / 2), s = 2;
    for (let i = 0; i < r.length; i++) r[i] = parseInt(n31.substring(s, s + 2), 16), s += 2;
    return r;
  }
  u(false, "invalid BytesLike value", e || "value", n31);
}
function v(n31, e) {
  return xa(n31, e, false);
}
function re(n31, e) {
  return xa(n31, e, true);
}
function fe(n31, e) {
  return !(typeof n31 != "string" || !n31.match(/^0x[0-9A-Fa-f]*$/) || typeof e == "number" && n31.length !== 2 + 2 * e || e === true && n31.length % 2 !== 0);
}
function lt(n31) {
  return fe(n31, true) || n31 instanceof Uint8Array;
}
var ua = "0123456789abcdef";
function g(n31) {
  let e = v(n31), t = "0x";
  for (let r = 0; r < e.length; r++) {
    let s = e[r];
    t += ua[(s & 240) >> 4] + ua[s & 15];
  }
  return t;
}
function _(n31) {
  return "0x" + n31.map((e) => g(e).substring(2)).join("");
}
function gt(n31) {
  return fe(n31, true) ? (n31.length - 2) / 2 : v(n31).length;
}
function De(n31, e, t) {
  let r = v(n31);
  return t != null && t > r.length && k(false, "cannot slice beyond data bounds", "BUFFER_OVERRUN", { buffer: r, length: r.length, offset: t }), g(r.slice(e ?? 0, t ?? r.length));
}
function ha(n31, e, t) {
  let r = v(n31);
  k(e >= r.length, "padding exceeds data length", "BUFFER_OVERRUN", { buffer: new Uint8Array(r), length: e, offset: e + 1 });
  let s = new Uint8Array(e);
  return s.fill(0), t ? s.set(r, e - r.length) : s.set(r, 0), g(s);
}
function Pe(n31, e) {
  return ha(n31, e, true);
}
function Gr(n31, e) {
  return ha(n31, e, false);
}
var cr = BigInt(0), Qe = BigInt(1), Fn = 9007199254740991;
function Gt(n31, e) {
  let t = _n(n31, "value"), r = BigInt(K(e, "width"));
  if (k(t >> r === cr, "overflow", "NUMERIC_FAULT", { operation: "fromTwos", fault: "overflow", value: n31 }), t >> r - Qe) {
    let s = (Qe << r) - Qe;
    return -((~t & s) + Qe);
  }
  return t;
}
function Gn(n31, e) {
  let t = D(n31, "value"), r = BigInt(K(e, "width")), s = Qe << r - Qe;
  if (t < cr) {
    t = -t, k(t <= s, "too low", "NUMERIC_FAULT", { operation: "toTwos", fault: "overflow", value: n31 });
    let i = (Qe << r) - Qe;
    return (~t & i) + Qe;
  } else k(t < s, "too high", "NUMERIC_FAULT", { operation: "toTwos", fault: "overflow", value: n31 });
  return t;
}
function We(n31, e) {
  let t = _n(n31, "value"), r = BigInt(K(e, "bits"));
  return t & (Qe << r) - Qe;
}
function D(n31, e) {
  switch (typeof n31) {
    case "bigint":
      return n31;
    case "number":
      return u(Number.isInteger(n31), "underflow", e || "value", n31), u(n31 >= -Fn && n31 <= Fn, "overflow", e || "value", n31), BigInt(n31);
    case "string":
      try {
        if (n31 === "") throw new Error("empty string");
        return n31[0] === "-" && n31[1] !== "-" ? -BigInt(n31.substring(1)) : BigInt(n31);
      } catch (t) {
        u(false, `invalid BigNumberish string: ${t.message}`, e || "value", n31);
      }
  }
  u(false, "invalid BigNumberish value", e || "value", n31);
}
function _n(n31, e) {
  let t = D(n31, e);
  return k(t >= cr, "unsigned value cannot be negative", "NUMERIC_FAULT", { fault: "overflow", operation: "getUint", value: n31 }), t;
}
var pa = "0123456789abcdef";
function et(n31) {
  if (n31 instanceof Uint8Array) {
    let e = "0x0";
    for (let t of n31) e += pa[t >> 4], e += pa[t & 15];
    return BigInt(e);
  }
  return D(n31);
}
function K(n31, e) {
  switch (typeof n31) {
    case "bigint":
      return u(n31 >= -Fn && n31 <= Fn, "overflow", e || "value", n31), Number(n31);
    case "number":
      return u(Number.isInteger(n31), "underflow", e || "value", n31), u(n31 >= -Fn && n31 <= Fn, "overflow", e || "value", n31), n31;
    case "string":
      try {
        if (n31 === "") throw new Error("empty string");
        return K(BigInt(n31), e);
      } catch (t) {
        u(false, `invalid numeric string: ${t.message}`, e || "value", n31);
      }
  }
  u(false, "invalid numeric value", e || "value", n31);
}
function _r(n31) {
  return K(et(n31));
}
function Ne(n31, e) {
  let t = _n(n31, "value"), r = t.toString(16);
  if (e == null) r.length % 2 && (r = "0" + r);
  else {
    let s = K(e, "width");
    if (s === 0 && t === cr) return "0x";
    for (k(s * 2 >= r.length, `value exceeds width (${s} bytes)`, "NUMERIC_FAULT", { operation: "toBeHex", fault: "overflow", value: n31 }); r.length < s * 2; ) r = "0" + r;
  }
  return "0x" + r;
}
function Y(n31, e) {
  let t = _n(n31, "value");
  if (t === cr) {
    let i = e != null ? K(e, "width") : 0;
    return new Uint8Array(i);
  }
  let r = t.toString(16);
  if (r.length % 2 && (r = "0" + r), e != null) {
    let i = K(e, "width");
    for (; r.length < i * 2; ) r = "00" + r;
    k(i * 2 === r.length, `value exceeds width (${i} bytes)`, "NUMERIC_FAULT", { operation: "toBeArray", fault: "overflow", value: n31 });
  }
  let s = new Uint8Array(r.length / 2);
  for (let i = 0; i < s.length; i++) {
    let a = i * 2;
    s[i] = parseInt(r.substring(a, a + 2), 16);
  }
  return s;
}
function $r(n31) {
  let e = g(lt(n31) ? n31 : Y(n31)).substring(2);
  for (; e.startsWith("0"); ) e = e.substring(1);
  return e === "" && (e = "0"), "0x" + e;
}
var zr = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", Mr = null;
function lc(n31) {
  if (Mr == null) {
    Mr = {};
    for (let t = 0; t < zr.length; t++) Mr[zr[t]] = BigInt(t);
  }
  let e = Mr[n31];
  return u(e != null, "invalid base58 value", "letter", n31), e;
}
var dc = BigInt(0), js = BigInt(58);
function Hr(n31) {
  let e = v(n31), t = et(e), r = "";
  for (; t; ) r = zr[Number(t % js)] + r, t /= js;
  for (let s = 0; s < e.length && !e[s]; s++) r = zr[0] + r;
  return r;
}
function Vr(n31) {
  let e = dc;
  for (let t = 0; t < n31.length; t++) e *= js, e += lc(n31[t]);
  return e;
}
function uc(n31, e, t, r, s) {
  u(false, `invalid codepoint at offset ${e}; ${n31}`, "bytes", t);
}
function ba(n31, e, t, r, s) {
  if (n31 === "BAD_PREFIX" || n31 === "UNEXPECTED_CONTINUE") {
    let i = 0;
    for (let a = e + 1; a < t.length && t[a] >> 6 === 2; a++) i++;
    return i;
  }
  return n31 === "OVERRUN" ? t.length - e - 1 : 0;
}
function xc(n31, e, t, r, s) {
  return n31 === "OVERLONG" ? (u(typeof s == "number", "invalid bad code point for replacement", "badCodepoint", s), r.push(s), 0) : (r.push(65533), ba(n31, e, t, r, s));
}
var Zs = Object.freeze({ error: uc, ignore: ba, replace: xc });
function hc(n31, e) {
  e == null && (e = Zs.error);
  let t = v(n31, "bytes"), r = [], s = 0;
  for (; s < t.length; ) {
    let i = t[s++];
    if (i >> 7 === 0) {
      r.push(i);
      continue;
    }
    let a = null, o = null;
    if ((i & 224) === 192) a = 1, o = 127;
    else if ((i & 240) === 224) a = 2, o = 2047;
    else if ((i & 248) === 240) a = 3, o = 65535;
    else {
      (i & 192) === 128 ? s += e("UNEXPECTED_CONTINUE", s - 1, t, r) : s += e("BAD_PREFIX", s - 1, t, r);
      continue;
    }
    if (s - 1 + a >= t.length) {
      s += e("OVERRUN", s - 1, t, r);
      continue;
    }
    let c = i & (1 << 8 - a - 1) - 1;
    for (let f = 0; f < a; f++) {
      let d = t[s];
      if ((d & 192) != 128) {
        s += e("MISSING_CONTINUE", s, t, r), c = null;
        break;
      }
      c = c << 6 | d & 63, s++;
    }
    if (c !== null) {
      if (c > 1114111) {
        s += e("OUT_OF_RANGE", s - 1 - a, t, r, c);
        continue;
      }
      if (c >= 55296 && c <= 57343) {
        s += e("UTF16_SURROGATE", s - 1 - a, t, r, c);
        continue;
      }
      if (c <= o) {
        s += e("OVERLONG", s - 1 - a, t, r, c);
        continue;
      }
      r.push(c);
    }
  }
  return r;
}
function me(n31, e) {
  u(typeof n31 == "string", "invalid string value", "str", n31), e != null && (Dn(e), n31 = n31.normalize(e));
  let t = [];
  for (let r = 0; r < n31.length; r++) {
    let s = n31.charCodeAt(r);
    if (s < 128) t.push(s);
    else if (s < 2048) t.push(s >> 6 | 192), t.push(s & 63 | 128);
    else if ((s & 64512) == 55296) {
      r++;
      let i = n31.charCodeAt(r);
      u(r < n31.length && (i & 64512) === 56320, "invalid surrogate pair", "str", n31);
      let a = 65536 + ((s & 1023) << 10) + (i & 1023);
      t.push(a >> 18 | 240), t.push(a >> 12 & 63 | 128), t.push(a >> 6 & 63 | 128), t.push(a & 63 | 128);
    } else t.push(s >> 12 | 224), t.push(s >> 6 & 63 | 128), t.push(s & 63 | 128);
  }
  return new Uint8Array(t);
}
function pc(n31) {
  return n31.map((e) => e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10 & 1023) + 55296, (e & 1023) + 56320))).join("");
}
function Kr(n31, e) {
  return pc(hc(n31, e));
}
var bc = BigInt(-1), tt = BigInt(0), Mn = BigInt(1), mc = BigInt(5), $n = {}, zn = "0000";
for (; zn.length < 80; ) zn += zn;
function cn(n31) {
  let e = zn;
  for (; e.length < n31; ) e += e;
  return BigInt("1" + e.substring(0, n31));
}
function fr(n31, e, t) {
  let r = BigInt(e.width);
  if (e.signed) {
    let s = Mn << r - Mn;
    k(t == null || n31 >= -s && n31 < s, "overflow", "NUMERIC_FAULT", { operation: t, fault: "overflow", value: n31 }), n31 > tt ? n31 = Gt(We(n31, r), r) : n31 = -Gt(We(-n31, r), r);
  } else {
    let s = Mn << r;
    k(t == null || n31 >= 0 && n31 < s, "overflow", "NUMERIC_FAULT", { operation: t, fault: "overflow", value: n31 }), n31 = (n31 % s + s) % s & s - Mn;
  }
  return n31;
}
function Ys(n31) {
  typeof n31 == "number" && (n31 = `fixed128x${n31}`);
  let e = true, t = 128, r = 18;
  if (typeof n31 == "string") {
    if (n31 !== "fixed") if (n31 === "ufixed") e = false;
    else {
      let i = n31.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);
      u(i, "invalid fixed format", "format", n31), e = i[1] !== "u", t = parseInt(i[2]), r = parseInt(i[3]);
    }
  } else if (n31) {
    let i = n31, a = (o, c, f) => i[o] == null ? f : (u(typeof i[o] === c, "invalid fixed format (" + o + " not " + c + ")", "format." + o, i[o]), i[o]);
    e = a("signed", "boolean", e), t = a("width", "number", t), r = a("decimals", "number", r);
  }
  u(t % 8 === 0, "invalid FixedNumber width (not byte aligned)", "format.width", t), u(r <= 80, "invalid FixedNumber decimals (too large)", "format.decimals", r);
  let s = (e ? "" : "u") + "fixed" + String(t) + "x" + String(r);
  return { signed: e, width: t, decimals: r, name: s };
}
function gc(n31, e) {
  let t = "";
  n31 < tt && (t = "-", n31 *= bc);
  let r = n31.toString();
  if (e === 0) return t + r;
  for (; r.length <= e; ) r = zn + r;
  let s = r.length - e;
  for (r = r.substring(0, s) + "." + r.substring(s); r[0] === "0" && r[1] !== "."; ) r = r.substring(1);
  for (; r[r.length - 1] === "0" && r[r.length - 2] !== "."; ) r = r.substring(0, r.length - 1);
  return t + r;
}
var Hn = class n {
  format;
  #e;
  #t;
  #n;
  _value;
  constructor(e, t, r) {
    Ae(e, $n, "FixedNumber"), this.#t = t, this.#e = r;
    let s = gc(t, r.decimals);
    R(this, { format: r.name, _value: s }), this.#n = cn(r.decimals);
  }
  get signed() {
    return this.#e.signed;
  }
  get width() {
    return this.#e.width;
  }
  get decimals() {
    return this.#e.decimals;
  }
  get value() {
    return this.#t;
  }
  #r(e) {
    u(this.format === e.format, "incompatible format; use fixedNumber.toFormat", "other", e);
  }
  #s(e, t) {
    return e = fr(e, this.#e, t), new n($n, e, this.#e);
  }
  #i(e, t) {
    return this.#r(e), this.#s(this.#t + e.#t, t);
  }
  addUnsafe(e) {
    return this.#i(e);
  }
  add(e) {
    return this.#i(e, "add");
  }
  #a(e, t) {
    return this.#r(e), this.#s(this.#t - e.#t, t);
  }
  subUnsafe(e) {
    return this.#a(e);
  }
  sub(e) {
    return this.#a(e, "sub");
  }
  #c(e, t) {
    return this.#r(e), this.#s(this.#t * e.#t / this.#n, t);
  }
  mulUnsafe(e) {
    return this.#c(e);
  }
  mul(e) {
    return this.#c(e, "mul");
  }
  mulSignal(e) {
    this.#r(e);
    let t = this.#t * e.#t;
    return k(t % this.#n === tt, "precision lost during signalling mul", "NUMERIC_FAULT", { operation: "mulSignal", fault: "underflow", value: this }), this.#s(t / this.#n, "mulSignal");
  }
  #f(e, t) {
    return k(e.#t !== tt, "division by zero", "NUMERIC_FAULT", { operation: "div", fault: "divide-by-zero", value: this }), this.#r(e), this.#s(this.#t * this.#n / e.#t, t);
  }
  divUnsafe(e) {
    return this.#f(e);
  }
  div(e) {
    return this.#f(e, "div");
  }
  divSignal(e) {
    k(e.#t !== tt, "division by zero", "NUMERIC_FAULT", { operation: "div", fault: "divide-by-zero", value: this }), this.#r(e);
    let t = this.#t * this.#n;
    return k(t % e.#t === tt, "precision lost during signalling div", "NUMERIC_FAULT", { operation: "divSignal", fault: "underflow", value: this }), this.#s(t / e.#t, "divSignal");
  }
  cmp(e) {
    let t = this.value, r = e.value, s = this.decimals - e.decimals;
    return s > 0 ? r *= cn(s) : s < 0 && (t *= cn(-s)), t < r ? -1 : t > r ? 1 : 0;
  }
  eq(e) {
    return this.cmp(e) === 0;
  }
  lt(e) {
    return this.cmp(e) < 0;
  }
  lte(e) {
    return this.cmp(e) <= 0;
  }
  gt(e) {
    return this.cmp(e) > 0;
  }
  gte(e) {
    return this.cmp(e) >= 0;
  }
  floor() {
    let e = this.#t;
    return this.#t < tt && (e -= this.#n - Mn), e = this.#t / this.#n * this.#n, this.#s(e, "floor");
  }
  ceiling() {
    let e = this.#t;
    return this.#t > tt && (e += this.#n - Mn), e = this.#t / this.#n * this.#n, this.#s(e, "ceiling");
  }
  round(e) {
    if (e == null && (e = 0), e >= this.decimals) return this;
    let t = this.decimals - e, r = mc * cn(t - 1), s = this.value + r, i = cn(t);
    return s = s / i * i, fr(s, this.#e, "round"), new n($n, s, this.#e);
  }
  isZero() {
    return this.#t === tt;
  }
  isNegative() {
    return this.#t < tt;
  }
  toString() {
    return this._value;
  }
  toUnsafeFloat() {
    return parseFloat(this.toString());
  }
  toFormat(e) {
    return n.fromString(this.toString(), e);
  }
  static fromValue(e, t, r) {
    let s = t == null ? 0 : K(t), i = Ys(r), a = D(e, "value"), o = s - i.decimals;
    if (o > 0) {
      let c = cn(o);
      k(a % c === tt, "value loses precision for format", "NUMERIC_FAULT", { operation: "fromValue", fault: "underflow", value: e }), a /= c;
    } else o < 0 && (a *= cn(-o));
    return fr(a, i, "fromValue"), new n($n, a, i);
  }
  static fromString(e, t) {
    let r = e.match(/^(-?)([0-9]*)\.?([0-9]*)$/);
    u(r && r[2].length + r[3].length > 0, "invalid FixedNumber string value", "value", e);
    let s = Ys(t), i = r[2] || "0", a = r[3] || "";
    for (; a.length < s.decimals; ) a += zn;
    k(a.substring(s.decimals).match(/^0*$/), "too many decimals for format", "NUMERIC_FAULT", { operation: "fromString", fault: "underflow", value: e }), a = a.substring(0, s.decimals);
    let o = BigInt(r[1] + i + a);
    return fr(o, s, "fromString"), new n($n, o, s);
  }
  static fromBytes(e, t) {
    let r = et(v(e, "value")), s = Ys(t);
    return s.signed && (r = Gt(r, s.width)), fr(r, s, "fromBytes"), new n($n, r, s);
  }
};
function yc(n31) {
  let e = n31.toString(16);
  for (; e.length < 2; ) e = "0" + e;
  return "0x" + e;
}
function ma(n31, e, t) {
  let r = 0;
  for (let s = 0; s < t; s++) r = r * 256 + n31[e + s];
  return r;
}
function ga(n31, e, t, r) {
  let s = [];
  for (; t < e + 1 + r; ) {
    let i = ya(n31, t);
    s.push(i.result), t += i.consumed, k(t <= e + 1 + r, "child data too short", "BUFFER_OVERRUN", { buffer: n31, length: r, offset: e });
  }
  return { consumed: 1 + r, result: s };
}
function ya(n31, e) {
  k(n31.length !== 0, "data too short", "BUFFER_OVERRUN", { buffer: n31, length: 0, offset: 1 });
  let t = (r) => {
    k(r <= n31.length, "data short segment too short", "BUFFER_OVERRUN", { buffer: n31, length: n31.length, offset: r });
  };
  if (n31[e] >= 248) {
    let r = n31[e] - 247;
    t(e + 1 + r);
    let s = ma(n31, e + 1, r);
    return t(e + 1 + r + s), ga(n31, e, e + 1 + r, r + s);
  } else if (n31[e] >= 192) {
    let r = n31[e] - 192;
    return t(e + 1 + r), ga(n31, e, e + 1, r);
  } else if (n31[e] >= 184) {
    let r = n31[e] - 183;
    t(e + 1 + r);
    let s = ma(n31, e + 1, r);
    t(e + 1 + r + s);
    let i = g(n31.slice(e + 1 + r, e + 1 + r + s));
    return { consumed: 1 + r + s, result: i };
  } else if (n31[e] >= 128) {
    let r = n31[e] - 128;
    t(e + 1 + r);
    let s = g(n31.slice(e + 1, e + 1 + r));
    return { consumed: 1 + r, result: s };
  }
  return { consumed: 1, result: yc(n31[e]) };
}
function _t(n31) {
  let e = v(n31, "data"), t = ya(e, 0);
  return u(t.consumed === e.length, "unexpected junk after rlp payload", "data", n31), t.result;
}
function wa(n31) {
  let e = [];
  for (; n31; ) e.unshift(n31 & 255), n31 >>= 8;
  return e;
}
function Ea(n31) {
  if (Array.isArray(n31)) {
    let r = [];
    if (n31.forEach(function(i) {
      r = r.concat(Ea(i));
    }), r.length <= 55) return r.unshift(192 + r.length), r;
    let s = wa(r.length);
    return s.unshift(247 + s.length), s.concat(r);
  }
  let e = Array.prototype.slice.call(v(n31, "object"));
  if (e.length === 1 && e[0] <= 127) return e;
  if (e.length <= 55) return e.unshift(128 + e.length), e;
  let t = wa(e.length);
  return t.unshift(183 + t.length), t.concat(e);
}
var va = "0123456789abcdef";
function Fe(n31) {
  let e = "0x";
  for (let t of Ea(n31)) e += va[t >> 4], e += va[t & 15];
  return e;
}
var Aa = ["wei", "kwei", "mwei", "gwei", "szabo", "finney", "ether"];
function lr(n31, e) {
  let t = 18;
  if (typeof e == "string") {
    let r = Aa.indexOf(e);
    u(r >= 0, "invalid unit", "unit", e), t = 3 * r;
  } else e != null && (t = K(e, "unit"));
  return Hn.fromValue(n31, t, { decimals: t, width: 512 }).toString();
}
function dr(n31, e) {
  u(typeof n31 == "string", "value must be a string", "value", n31);
  let t = 18;
  if (typeof e == "string") {
    let r = Aa.indexOf(e);
    u(r >= 0, "invalid unit", "unit", e), t = 3 * r;
  } else e != null && (t = K(e, "unit"));
  return Hn.fromString(n31, { decimals: t, width: 512 }).value;
}
function Wr(n31) {
  let e = v(n31, "randomBytes");
  e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
  let t = g(e);
  return [t.substring(2, 10), t.substring(10, 14), t.substring(14, 18), t.substring(18, 22), t.substring(22, 34)].join("-");
}
var we = 32, Xs = new Uint8Array(we), kc = ["then"], Jr = {}, Sa = /* @__PURE__ */ new WeakMap();
function fn(n31) {
  return Sa.get(n31);
}
function Ia(n31, e) {
  Sa.set(n31, e);
}
function ur(n31, e) {
  let t = new Error(`deferred error during ABI decoding triggered accessing ${n31}`);
  throw t.error = e, t;
}
function Qs(n31, e, t) {
  return n31.indexOf(null) >= 0 ? e.map((r, s) => r instanceof dt ? Qs(fn(r), r, t) : r) : n31.reduce((r, s, i) => {
    let a = e.getValue(s);
    return s in r || (t && a instanceof dt && (a = Qs(fn(a), a, t)), r[s] = a), r;
  }, {});
}
var dt = class n2 extends Array {
  #e;
  constructor(...e) {
    let t = e[0], r = e[1], s = (e[2] || []).slice(), i = true;
    t !== Jr && (r = e, s = [], i = false), super(r.length), r.forEach((c, f) => {
      this[f] = c;
    });
    let a = s.reduce((c, f) => (typeof f == "string" && c.set(f, (c.get(f) || 0) + 1), c), /* @__PURE__ */ new Map());
    if (Ia(this, Object.freeze(r.map((c, f) => {
      let d = s[f];
      return d != null && a.get(d) === 1 ? d : null;
    }))), this.#e = [], this.#e == null && this.#e, !i) return;
    Object.freeze(this);
    let o = new Proxy(this, { get: (c, f, d) => {
      if (typeof f == "string") {
        if (f.match(/^[0-9]+$/)) {
          let x = K(f, "%index");
          if (x < 0 || x >= this.length) throw new RangeError("out of result range");
          let p = c[x];
          return p instanceof Error && ur(`index ${x}`, p), p;
        }
        if (kc.indexOf(f) >= 0) return Reflect.get(c, f, d);
        let l = c[f];
        if (l instanceof Function) return function(...x) {
          return l.apply(this === d ? c : this, x);
        };
        if (!(f in c)) return c.getValue.apply(this === d ? c : this, [f]);
      }
      return Reflect.get(c, f, d);
    } });
    return Ia(o, fn(this)), o;
  }
  toArray(e) {
    let t = [];
    return this.forEach((r, s) => {
      r instanceof Error && ur(`index ${s}`, r), e && r instanceof n2 && (r = r.toArray(e)), t.push(r);
    }), t;
  }
  toObject(e) {
    let t = fn(this);
    return t.reduce((r, s, i) => (k(s != null, `value at index ${i} unnamed`, "UNSUPPORTED_OPERATION", { operation: "toObject()" }), Qs(t, this, e)), {});
  }
  slice(e, t) {
    e == null && (e = 0), e < 0 && (e += this.length, e < 0 && (e = 0)), t == null && (t = this.length), t < 0 && (t += this.length, t < 0 && (t = 0)), t > this.length && (t = this.length);
    let r = fn(this), s = [], i = [];
    for (let a = e; a < t; a++) s.push(this[a]), i.push(r[a]);
    return new n2(Jr, s, i);
  }
  filter(e, t) {
    let r = fn(this), s = [], i = [];
    for (let a = 0; a < this.length; a++) {
      let o = this[a];
      o instanceof Error && ur(`index ${a}`, o), e.call(t, o, a, this) && (s.push(o), i.push(r[a]));
    }
    return new n2(Jr, s, i);
  }
  map(e, t) {
    let r = [];
    for (let s = 0; s < this.length; s++) {
      let i = this[s];
      i instanceof Error && ur(`index ${s}`, i), r.push(e.call(t, i, s, this));
    }
    return r;
  }
  getValue(e) {
    let t = fn(this).indexOf(e);
    if (t === -1) return;
    let r = this[t];
    return r instanceof Error && ur(`property ${JSON.stringify(e)}`, r.error), r;
  }
  static fromItems(e, t) {
    return new n2(Jr, e, t);
  }
};
function ka(n31) {
  let e = Y(n31);
  return k(e.length <= we, "value out-of-bounds", "BUFFER_OVERRUN", { buffer: e, length: we, offset: e.length }), e.length !== we && (e = re(_([Xs.slice(e.length % we), e]))), e;
}
var de = class {
  name;
  type;
  localName;
  dynamic;
  constructor(e, t, r, s) {
    R(this, { name: e, type: t, localName: r, dynamic: s }, { name: "string", type: "string", localName: "string", dynamic: "boolean" });
  }
  _throwError(e, t) {
    u(false, e, this.localName, t);
  }
}, ln = class {
  #e;
  #t;
  constructor() {
    this.#e = [], this.#t = 0;
  }
  get data() {
    return _(this.#e);
  }
  get length() {
    return this.#t;
  }
  #n(e) {
    return this.#e.push(e), this.#t += e.length, e.length;
  }
  appendWriter(e) {
    return this.#n(re(e.data));
  }
  writeBytes(e) {
    let t = re(e), r = t.length % we;
    return r && (t = re(_([t, Xs.slice(r)]))), this.#n(t);
  }
  writeValue(e) {
    return this.#n(ka(e));
  }
  writeUpdatableValue() {
    let e = this.#e.length;
    return this.#e.push(Xs), this.#t += we, (t) => {
      this.#e[e] = ka(t);
    };
  }
}, qr = class n3 {
  allowLoose;
  #e;
  #t;
  #n;
  #r;
  #s;
  constructor(e, t, r) {
    R(this, { allowLoose: !!t }), this.#e = re(e), this.#n = 0, this.#r = null, this.#s = r ?? 1024, this.#t = 0;
  }
  get data() {
    return g(this.#e);
  }
  get dataLength() {
    return this.#e.length;
  }
  get consumed() {
    return this.#t;
  }
  get bytes() {
    return new Uint8Array(this.#e);
  }
  #i(e) {
    if (this.#r) return this.#r.#i(e);
    this.#n += e, k(this.#s < 1 || this.#n <= this.#s * this.dataLength, `compressed ABI data exceeds inflation ratio of ${this.#s} ( see: https://github.com/ethers-io/ethers.js/issues/4537 )`, "BUFFER_OVERRUN", { buffer: re(this.#e), offset: this.#t, length: e, info: { bytesRead: this.#n, dataLength: this.dataLength } });
  }
  #a(e, t, r) {
    let s = Math.ceil(t / we) * we;
    return this.#t + s > this.#e.length && (this.allowLoose && r && this.#t + t <= this.#e.length ? s = t : k(false, "data out-of-bounds", "BUFFER_OVERRUN", { buffer: re(this.#e), length: this.#e.length, offset: this.#t + s })), this.#e.slice(this.#t, this.#t + s);
  }
  subReader(e) {
    let t = new n3(this.#e.slice(this.#t + e), this.allowLoose, this.#s);
    return t.#r = this, t;
  }
  readBytes(e, t) {
    let r = this.#a(0, e, !!t);
    return this.#i(e), this.#t += r.length, r.slice(0, e);
  }
  readValue() {
    return et(this.readBytes(we));
  }
  readIndex() {
    return _r(this.readBytes(we));
  }
};
function Ie(n31) {
  if (!Number.isSafeInteger(n31) || n31 < 0) throw new Error(`Wrong positive integer: ${n31}`);
}
function xr(n31, ...e) {
  if (!(n31 instanceof Uint8Array)) throw new Error("Expected Uint8Array");
  if (e.length > 0 && !e.includes(n31.length)) throw new Error(`Expected Uint8Array of length ${e}, not of length=${n31.length}`);
}
function jr(n31) {
  if (typeof n31 != "function" || typeof n31.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ie(n31.outputLen), Ie(n31.blockLen);
}
function yt(n31, e = true) {
  if (n31.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n31.finished) throw new Error("Hash#digest() has already been called");
}
function Zr(n31, e) {
  xr(n31);
  let t = e.outputLen;
  if (n31.length < t) throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
var Yr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
var Ba = (n31) => n31 instanceof Uint8Array;
var Vn = (n31) => new Uint32Array(n31.buffer, n31.byteOffset, Math.floor(n31.byteLength / 4)), Kn = (n31) => new DataView(n31.buffer, n31.byteOffset, n31.byteLength), nt = (n31, e) => n31 << 32 - e | n31 >>> e, Sc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Sc) throw new Error("Non little-endian hardware is not supported");
var Bc = async () => {
};
async function Xr(n31, e, t) {
  let r = Date.now();
  for (let s = 0; s < n31; s++) {
    t(s);
    let i = Date.now() - r;
    i >= 0 && i < e || (await Bc(), r += i);
  }
}
function Pc(n31) {
  if (typeof n31 != "string") throw new Error(`utf8ToBytes expected string, got ${typeof n31}`);
  return new Uint8Array(new TextEncoder().encode(n31));
}
function rt(n31) {
  if (typeof n31 == "string" && (n31 = Pc(n31)), !Ba(n31)) throw new Error(`expected Uint8Array, got ${typeof n31}`);
  return n31;
}
function Pa(...n31) {
  let e = new Uint8Array(n31.reduce((r, s) => r + s.length, 0)), t = 0;
  return n31.forEach((r) => {
    if (!Ba(r)) throw new Error("Uint8Array expected");
    e.set(r, t), t += r.length;
  }), e;
}
var $t = class {
  clone() {
    return this._cloneInto();
  }
}, Nc = {}.toString;
function Qr(n31, e) {
  if (e !== void 0 && Nc.call(e) !== "[object Object]") throw new Error("Options should be object or undefined");
  return Object.assign(n31, e);
}
function Mt(n31) {
  let e = (r) => n31().update(rt(r)).digest(), t = n31();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n31(), e;
}
function Na(n31) {
  let e = (r, s) => n31(s).update(rt(r)).digest(), t = n31({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r) => n31(r), e;
}
function Ta(n31 = 32) {
  if (Yr && typeof Yr.getRandomValues == "function") return Yr.getRandomValues(new Uint8Array(n31));
  throw new Error("crypto.getRandomValues must be defined");
}
var es = class extends $t {
  constructor(e, t) {
    super(), this.finished = false, this.destroyed = false, jr(e);
    let r = rt(t);
    if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    let s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let a = 0; a < i.length; a++) i[a] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let a = 0; a < i.length; a++) i[a] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return yt(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    yt(this), xr(e, this.outputLen), this.finished = true, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    let e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    let { oHash: t, iHash: r, finished: s, destroyed: i, blockLen: a, outputLen: o } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = a, e.outputLen = o, e.oHash = t._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
  }
}, dn = (n31, e, t) => new es(n31, e).update(t).digest();
dn.create = (n31, e) => new es(n31, e);
function Tc(n31, e, t, r) {
  jr(n31);
  let s = Qr({ dkLen: 32, asyncTick: 10 }, r), { c: i, dkLen: a, asyncTick: o } = s;
  if (Ie(i), Ie(a), Ie(o), i < 1) throw new Error("PBKDF2: iterations (c) should be >= 1");
  let c = rt(e), f = rt(t), d = new Uint8Array(a), l = dn.create(n31, c), x = l._cloneInto().update(f);
  return { c: i, dkLen: a, asyncTick: o, DK: d, PRF: l, PRFSalt: x };
}
function Rc(n31, e, t, r, s) {
  return n31.destroy(), e.destroy(), r && r.destroy(), s.fill(0), t;
}
function hr(n31, e, t, r) {
  let { c: s, dkLen: i, DK: a, PRF: o, PRFSalt: c } = Tc(n31, e, t, r), f, d = new Uint8Array(4), l = Kn(d), x = new Uint8Array(o.outputLen);
  for (let p = 1, b = 0; b < i; p++, b += o.outputLen) {
    let h = a.subarray(b, b + o.outputLen);
    l.setInt32(0, p, false), (f = c._cloneInto(f)).update(d).digestInto(x), h.set(x.subarray(0, h.length));
    for (let m = 1; m < s; m++) {
      o._cloneInto(f).update(x).digestInto(x);
      for (let y = 0; y < h.length; y++) h[y] ^= x[y];
    }
  }
  return Rc(o, c, a, f, x);
}
function Oc(n31, e, t, r) {
  if (typeof n31.setBigUint64 == "function") return n31.setBigUint64(e, t, r);
  let s = BigInt(32), i = BigInt(4294967295), a = Number(t >> s & i), o = Number(t & i), c = r ? 4 : 0, f = r ? 0 : 4;
  n31.setUint32(e + c, a, r), n31.setUint32(e + f, o, r);
}
var zt = class extends $t {
  constructor(e, t, r, s) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = s, this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.buffer = new Uint8Array(e), this.view = Kn(this.buffer);
  }
  update(e) {
    yt(this);
    let { view: t, buffer: r, blockLen: s } = this;
    e = rt(e);
    let i = e.length;
    for (let a = 0; a < i; ) {
      let o = Math.min(s - this.pos, i - a);
      if (o === s) {
        let c = Kn(e);
        for (; s <= i - a; a += s) this.process(c, a);
        continue;
      }
      r.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === s && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    yt(this), Zr(e, this), this.finished = true;
    let { buffer: t, view: r, blockLen: s, isLE: i } = this, { pos: a } = this;
    t[a++] = 128, this.buffer.subarray(a).fill(0), this.padOffset > s - a && (this.process(r, 0), a = 0);
    for (let l = a; l < s; l++) t[l] = 0;
    Oc(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    let o = Kn(e), c = this.outputLen;
    if (c % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    let f = c / 4, d = this.get();
    if (f > d.length) throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++) o.setUint32(4 * l, d[l], i);
  }
  digest() {
    let { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    let r = e.slice(0, t);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    let { blockLen: t, buffer: r, length: s, finished: i, destroyed: a, pos: o } = this;
    return e.length = s, e.pos = o, e.finished = i, e.destroyed = a, s % t && e.buffer.set(r), e;
  }
};
var Cc = (n31, e, t) => n31 & e ^ ~n31 & t, Lc = (n31, e, t) => n31 & e ^ n31 & t ^ e & t, Uc = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), Ht = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), Vt = new Uint32Array(64), ei = class extends zt {
  constructor() {
    super(64, 32, 8, false), this.A = Ht[0] | 0, this.B = Ht[1] | 0, this.C = Ht[2] | 0, this.D = Ht[3] | 0, this.E = Ht[4] | 0, this.F = Ht[5] | 0, this.G = Ht[6] | 0, this.H = Ht[7] | 0;
  }
  get() {
    let { A: e, B: t, C: r, D: s, E: i, F: a, G: o, H: c } = this;
    return [e, t, r, s, i, a, o, c];
  }
  set(e, t, r, s, i, a, o, c) {
    this.A = e | 0, this.B = t | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = a | 0, this.G = o | 0, this.H = c | 0;
  }
  process(e, t) {
    for (let l = 0; l < 16; l++, t += 4) Vt[l] = e.getUint32(t, false);
    for (let l = 16; l < 64; l++) {
      let x = Vt[l - 15], p = Vt[l - 2], b = nt(x, 7) ^ nt(x, 18) ^ x >>> 3, h = nt(p, 17) ^ nt(p, 19) ^ p >>> 10;
      Vt[l] = h + Vt[l - 7] + b + Vt[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: a, E: o, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      let x = nt(o, 6) ^ nt(o, 11) ^ nt(o, 25), p = d + x + Cc(o, c, f) + Uc[l] + Vt[l] | 0, h = (nt(r, 2) ^ nt(r, 13) ^ nt(r, 22)) + Lc(r, s, i) | 0;
      d = f, f = c, c = o, o = a + p | 0, a = i, i = s, s = r, r = p + h | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, a, o, c, f, d);
  }
  roundClean() {
    Vt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
};
var wt = Mt(() => new ei());
var ts = BigInt(4294967295), ti = BigInt(32);
function Ra(n31, e = false) {
  return e ? { h: Number(n31 & ts), l: Number(n31 >> ti & ts) } : { h: Number(n31 >> ti & ts) | 0, l: Number(n31 & ts) | 0 };
}
function ni(n31, e = false) {
  let t = new Uint32Array(n31.length), r = new Uint32Array(n31.length);
  for (let s = 0; s < n31.length; s++) {
    let { h: i, l: a } = Ra(n31[s], e);
    [t[s], r[s]] = [i, a];
  }
  return [t, r];
}
var Dc = (n31, e) => BigInt(n31 >>> 0) << ti | BigInt(e >>> 0), Fc = (n31, e, t) => n31 >>> t, Gc = (n31, e, t) => n31 << 32 - t | e >>> t, _c = (n31, e, t) => n31 >>> t | e << 32 - t, $c = (n31, e, t) => n31 << 32 - t | e >>> t, Mc = (n31, e, t) => n31 << 64 - t | e >>> t - 32, zc = (n31, e, t) => n31 >>> t - 32 | e << 64 - t, Hc = (n31, e) => e, Vc = (n31, e) => n31, ri = (n31, e, t) => n31 << t | e >>> 32 - t, si = (n31, e, t) => e << t | n31 >>> 32 - t, ii = (n31, e, t) => e << t - 32 | n31 >>> 64 - t, ai = (n31, e, t) => n31 << t - 32 | e >>> 64 - t;
function Kc(n31, e, t, r) {
  let s = (e >>> 0) + (r >>> 0);
  return { h: n31 + t + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
var Wc = (n31, e, t) => (n31 >>> 0) + (e >>> 0) + (t >>> 0), Jc = (n31, e, t, r) => e + t + r + (n31 / 2 ** 32 | 0) | 0, qc = (n31, e, t, r) => (n31 >>> 0) + (e >>> 0) + (t >>> 0) + (r >>> 0), jc = (n31, e, t, r, s) => e + t + r + s + (n31 / 2 ** 32 | 0) | 0, Zc = (n31, e, t, r, s) => (n31 >>> 0) + (e >>> 0) + (t >>> 0) + (r >>> 0) + (s >>> 0), Yc = (n31, e, t, r, s, i) => e + t + r + s + i + (n31 / 2 ** 32 | 0) | 0;
var Xc = { fromBig: Ra, split: ni, toBig: Dc, shrSH: Fc, shrSL: Gc, rotrSH: _c, rotrSL: $c, rotrBH: Mc, rotrBL: zc, rotr32H: Hc, rotr32L: Vc, rotlSH: ri, rotlSL: si, rotlBH: ii, rotlBL: ai, add: Kc, add3L: Wc, add3H: Jc, add4L: qc, add4H: jc, add5H: Yc, add5L: Zc }, G = Xc;
var [Qc, ef] = G.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((n31) => BigInt(n31))), Kt = new Uint32Array(80), Wt = new Uint32Array(80), oi = class extends zt {
  constructor() {
    super(128, 64, 16, false), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  get() {
    let { Ah: e, Al: t, Bh: r, Bl: s, Ch: i, Cl: a, Dh: o, Dl: c, Eh: f, El: d, Fh: l, Fl: x, Gh: p, Gl: b, Hh: h, Hl: m } = this;
    return [e, t, r, s, i, a, o, c, f, d, l, x, p, b, h, m];
  }
  set(e, t, r, s, i, a, o, c, f, d, l, x, p, b, h, m) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = a | 0, this.Dh = o | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = x | 0, this.Gh = p | 0, this.Gl = b | 0, this.Hh = h | 0, this.Hl = m | 0;
  }
  process(e, t) {
    for (let E = 0; E < 16; E++, t += 4) Kt[E] = e.getUint32(t), Wt[E] = e.getUint32(t += 4);
    for (let E = 16; E < 80; E++) {
      let C = Kt[E - 15] | 0, S = Wt[E - 15] | 0, P = G.rotrSH(C, S, 1) ^ G.rotrSH(C, S, 8) ^ G.shrSH(C, S, 7), T = G.rotrSL(C, S, 1) ^ G.rotrSL(C, S, 8) ^ G.shrSL(C, S, 7), O = Kt[E - 2] | 0, j = Wt[E - 2] | 0, $ = G.rotrSH(O, j, 19) ^ G.rotrBH(O, j, 61) ^ G.shrSH(O, j, 6), F = G.rotrSL(O, j, 19) ^ G.rotrBL(O, j, 61) ^ G.shrSL(O, j, 6), ee = G.add4L(T, F, Wt[E - 7], Wt[E - 16]), ne = G.add4H(ee, P, $, Kt[E - 7], Kt[E - 16]);
      Kt[E] = ne | 0, Wt[E] = ee | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: a, Ch: o, Cl: c, Dh: f, Dl: d, Eh: l, El: x, Fh: p, Fl: b, Gh: h, Gl: m, Hh: y, Hl: I } = this;
    for (let E = 0; E < 80; E++) {
      let C = G.rotrSH(l, x, 14) ^ G.rotrSH(l, x, 18) ^ G.rotrBH(l, x, 41), S = G.rotrSL(l, x, 14) ^ G.rotrSL(l, x, 18) ^ G.rotrBL(l, x, 41), P = l & p ^ ~l & h, T = x & b ^ ~x & m, O = G.add5L(I, S, T, ef[E], Wt[E]), j = G.add5H(O, y, C, P, Qc[E], Kt[E]), $ = O | 0, F = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), ee = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), ne = r & i ^ r & o ^ i & o, be = s & a ^ s & c ^ a & c;
      y = h | 0, I = m | 0, h = p | 0, m = b | 0, p = l | 0, b = x | 0, { h: l, l: x } = G.add(f | 0, d | 0, j | 0, $ | 0), f = o | 0, d = c | 0, o = i | 0, c = a | 0, i = r | 0, a = s | 0;
      let A = G.add3L($, ee, be);
      r = G.add3H(A, j, F, ne), s = A | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: a } = G.add(this.Bh | 0, this.Bl | 0, i | 0, a | 0), { h: o, l: c } = G.add(this.Ch | 0, this.Cl | 0, o | 0, c | 0), { h: f, l: d } = G.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: x } = G.add(this.Eh | 0, this.El | 0, l | 0, x | 0), { h: p, l: b } = G.add(this.Fh | 0, this.Fl | 0, p | 0, b | 0), { h, l: m } = G.add(this.Gh | 0, this.Gl | 0, h | 0, m | 0), { h: y, l: I } = G.add(this.Hh | 0, this.Hl | 0, y | 0, I | 0), this.set(r, s, i, a, o, c, f, d, l, x, p, b, h, m, y, I);
  }
  roundClean() {
    Kt.fill(0), Wt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var ns = Mt(() => new oi());
function tf() {
  if (typeof self < "u") return self;
  if (typeof window < "u") return window;
  if (typeof global < "u") return global;
  throw new Error("unable to locate global object");
}
var Oa = tf(), Ca = Oa.crypto || Oa.msCrypto;
function ci(n31) {
  switch (n31) {
    case "sha256":
      return wt.create();
    case "sha512":
      return ns.create();
  }
  u(false, "invalid hashing algorithm name", "algorithm", n31);
}
function La(n31, e) {
  let t = { sha256: wt, sha512: ns }[n31];
  return u(t != null, "invalid hmac algorithm", "algorithm", n31), dn.create(t, e);
}
function Ua(n31, e, t, r, s) {
  let i = { sha256: wt, sha512: ns }[s];
  return u(i != null, "invalid pbkdf2 algorithm", "algorithm", s), hr(i, n31, e, { c: t, dkLen: r });
}
function Da(n31) {
  k(Ca != null, "platform does not support secure random numbers", "UNSUPPORTED_OPERATION", { operation: "randomBytes" }), u(Number.isInteger(n31) && n31 > 0 && n31 <= 1024, "invalid length", "length", n31);
  let e = new Uint8Array(n31);
  return Ca.getRandomValues(e), e;
}
var Fa = false, Ga = function(n31, e, t) {
  return La(n31, e).update(t).digest();
}, _a = Ga;
function vt(n31, e, t) {
  let r = v(e, "key"), s = v(t, "data");
  return g(_a(n31, r, s));
}
vt._ = Ga;
vt.lock = function() {
  Fa = true;
};
vt.register = function(n31) {
  if (Fa) throw new Error("computeHmac is locked");
  _a = n31;
};
Object.freeze(vt);
var [za, Ha, Va] = [[], [], []], nf = BigInt(0), pr = BigInt(1), rf = BigInt(2), sf = BigInt(7), af = BigInt(256), of = BigInt(113);
for (let n31 = 0, e = pr, t = 1, r = 0; n31 < 24; n31++) {
  [t, r] = [r, (2 * t + 3 * r) % 5], za.push(2 * (5 * r + t)), Ha.push((n31 + 1) * (n31 + 2) / 2 % 64);
  let s = nf;
  for (let i = 0; i < 7; i++) e = (e << pr ^ (e >> sf) * of) % af, e & rf && (s ^= pr << (pr << BigInt(i)) - pr);
  Va.push(s);
}
var [cf, ff] = ni(Va, true), $a = (n31, e, t) => t > 32 ? ii(n31, e, t) : ri(n31, e, t), Ma = (n31, e, t) => t > 32 ? ai(n31, e, t) : si(n31, e, t);
function lf(n31, e = 24) {
  let t = new Uint32Array(10);
  for (let r = 24 - e; r < 24; r++) {
    for (let a = 0; a < 10; a++) t[a] = n31[a] ^ n31[a + 10] ^ n31[a + 20] ^ n31[a + 30] ^ n31[a + 40];
    for (let a = 0; a < 10; a += 2) {
      let o = (a + 8) % 10, c = (a + 2) % 10, f = t[c], d = t[c + 1], l = $a(f, d, 1) ^ t[o], x = Ma(f, d, 1) ^ t[o + 1];
      for (let p = 0; p < 50; p += 10) n31[a + p] ^= l, n31[a + p + 1] ^= x;
    }
    let s = n31[2], i = n31[3];
    for (let a = 0; a < 24; a++) {
      let o = Ha[a], c = $a(s, i, o), f = Ma(s, i, o), d = za[a];
      s = n31[d], i = n31[d + 1], n31[d] = c, n31[d + 1] = f;
    }
    for (let a = 0; a < 50; a += 10) {
      for (let o = 0; o < 10; o++) t[o] = n31[a + o];
      for (let o = 0; o < 10; o++) n31[a + o] ^= ~t[(o + 2) % 10] & t[(o + 4) % 10];
    }
    n31[0] ^= cf[r], n31[1] ^= ff[r];
  }
  t.fill(0);
}
var rs = class n4 extends $t {
  constructor(e, t, r, s = false, i = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = r, this.enableXOF = s, this.rounds = i, this.pos = 0, this.posOut = 0, this.finished = false, this.destroyed = false, Ie(r), 0 >= this.blockLen || this.blockLen >= 200) throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = Vn(this.state);
  }
  keccak() {
    lf(this.state32, this.rounds), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    yt(this);
    let { blockLen: t, state: r } = this;
    e = rt(e);
    let s = e.length;
    for (let i = 0; i < s; ) {
      let a = Math.min(t - this.pos, s - i);
      for (let o = 0; o < a; o++) r[this.pos++] ^= e[i++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished) return;
    this.finished = true;
    let { state: e, suffix: t, pos: r, blockLen: s } = this;
    e[r] ^= t, (t & 128) !== 0 && r === s - 1 && this.keccak(), e[s - 1] ^= 128, this.keccak();
  }
  writeInto(e) {
    yt(this, false), xr(e), this.finish();
    let t = this.state, { blockLen: r } = this;
    for (let s = 0, i = e.length; s < i; ) {
      this.posOut >= r && this.keccak();
      let a = Math.min(r - this.posOut, i - s);
      e.set(t.subarray(this.posOut, this.posOut + a), s), this.posOut += a, s += a;
    }
    return e;
  }
  xofInto(e) {
    if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
    return this.writeInto(e);
  }
  xof(e) {
    return Ie(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (Zr(e, this), this.finished) throw new Error("digest() was already called");
    return this.writeInto(e), this.destroy(), e;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true, this.state.fill(0);
  }
  _cloneInto(e) {
    let { blockLen: t, suffix: r, outputLen: s, rounds: i, enableXOF: a } = this;
    return e || (e = new n4(t, r, s, a, i)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = i, e.suffix = r, e.outputLen = s, e.enableXOF = a, e.destroyed = this.destroyed, e;
  }
}, Jt = (n31, e, t) => Mt(() => new rs(e, n31, t)), nx = Jt(6, 144, 224 / 8), rx = Jt(6, 136, 256 / 8), sx = Jt(6, 104, 384 / 8), ix = Jt(6, 72, 512 / 8), ax = Jt(1, 144, 224 / 8), Ka = Jt(1, 136, 256 / 8), ox = Jt(1, 104, 384 / 8), cx = Jt(1, 72, 512 / 8), Wa = (n31, e, t) => Na((r = {}) => new rs(e, n31, r.dkLen === void 0 ? t : r.dkLen, true)), fx = Wa(31, 168, 128 / 8), lx = Wa(31, 136, 256 / 8);
var Ja = false, qa = function(n31) {
  return Ka(n31);
}, ja = qa;
function z(n31) {
  let e = v(n31, "data");
  return g(ja(e));
}
z._ = qa;
z.lock = function() {
  Ja = true;
};
z.register = function(n31) {
  if (Ja) throw new TypeError("keccak256 is locked");
  ja = n31;
};
Object.freeze(z);
var df = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ya = Uint8Array.from({ length: 16 }, (n31, e) => e), uf = Ya.map((n31) => (9 * n31 + 5) % 16), li = [Ya], di = [uf];
for (let n31 = 0; n31 < 4; n31++) for (let e of [li, di]) e.push(e[n31].map((t) => df[t]));
var Xa = [[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map((n31) => new Uint8Array(n31)), xf = li.map((n31, e) => n31.map((t) => Xa[e][t])), hf = di.map((n31, e) => n31.map((t) => Xa[e][t])), pf = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), bf = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ss = (n31, e) => n31 << e | n31 >>> 32 - e;
function Za(n31, e, t, r) {
  return n31 === 0 ? e ^ t ^ r : n31 === 1 ? e & t | ~e & r : n31 === 2 ? (e | ~t) ^ r : n31 === 3 ? e & r | t & ~r : e ^ (t | ~r);
}
var is = new Uint32Array(16), fi = class extends zt {
  constructor() {
    super(64, 20, 8, true), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    let { h0: e, h1: t, h2: r, h3: s, h4: i } = this;
    return [e, t, r, s, i];
  }
  set(e, t, r, s, i) {
    this.h0 = e | 0, this.h1 = t | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, t) {
    for (let p = 0; p < 16; p++, t += 4) is[p] = e.getUint32(t, true);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, a = i, o = this.h2 | 0, c = o, f = this.h3 | 0, d = f, l = this.h4 | 0, x = l;
    for (let p = 0; p < 5; p++) {
      let b = 4 - p, h = pf[p], m = bf[p], y = li[p], I = di[p], E = xf[p], C = hf[p];
      for (let S = 0; S < 16; S++) {
        let P = ss(r + Za(p, i, o, f) + is[y[S]] + h, E[S]) + l | 0;
        r = l, l = f, f = ss(o, 10) | 0, o = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        let P = ss(s + Za(b, a, c, d) + is[I[S]] + m, C[S]) + x | 0;
        s = x, x = d, d = ss(c, 10) | 0, c = a, a = P;
      }
    }
    this.set(this.h1 + o + d | 0, this.h2 + f + x | 0, this.h3 + l + s | 0, this.h4 + r + a | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    is.fill(0);
  }
  destroy() {
    this.destroyed = true, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}, Qa = Mt(() => new fi());
var eo = false, to = function(n31) {
  return Qa(n31);
}, no = to;
function Et(n31) {
  let e = v(n31, "data");
  return g(no(e));
}
Et._ = to;
Et.lock = function() {
  eo = true;
};
Et.register = function(n31) {
  if (eo) throw new TypeError("ripemd160 is locked");
  no = n31;
};
Object.freeze(Et);
var ro = false, so = function(n31, e, t, r, s) {
  return Ua(n31, e, t, r, s);
}, io = so;
function Ge(n31, e, t, r, s) {
  let i = v(n31, "password"), a = v(e, "salt");
  return g(io(i, a, t, r, s));
}
Ge._ = so;
Ge.lock = function() {
  ro = true;
};
Ge.register = function(n31) {
  if (ro) throw new Error("pbkdf2 is locked");
  io = n31;
};
Object.freeze(Ge);
var ao = false, oo = function(n31) {
  return new Uint8Array(Da(n31));
}, co = oo;
function _e(n31) {
  return co(n31);
}
_e._ = oo;
_e.lock = function() {
  ao = true;
};
_e.register = function(n31) {
  if (ao) throw new Error("randomBytes is locked");
  co = n31;
};
Object.freeze(_e);
var W = (n31, e) => n31 << e | n31 >>> 32 - e;
function fo(n31, e, t, r, s, i) {
  let a = n31[e++] ^ t[r++], o = n31[e++] ^ t[r++], c = n31[e++] ^ t[r++], f = n31[e++] ^ t[r++], d = n31[e++] ^ t[r++], l = n31[e++] ^ t[r++], x = n31[e++] ^ t[r++], p = n31[e++] ^ t[r++], b = n31[e++] ^ t[r++], h = n31[e++] ^ t[r++], m = n31[e++] ^ t[r++], y = n31[e++] ^ t[r++], I = n31[e++] ^ t[r++], E = n31[e++] ^ t[r++], C = n31[e++] ^ t[r++], S = n31[e++] ^ t[r++], P = a, T = o, O = c, j = f, $ = d, F = l, ee = x, ne = p, be = b, A = h, B = m, L = y, V = I, M = E, te = C, ce = S;
  for (let Ee = 0; Ee < 8; Ee += 2) $ ^= W(P + V | 0, 7), be ^= W($ + P | 0, 9), V ^= W(be + $ | 0, 13), P ^= W(V + be | 0, 18), A ^= W(F + T | 0, 7), M ^= W(A + F | 0, 9), T ^= W(M + A | 0, 13), F ^= W(T + M | 0, 18), te ^= W(B + ee | 0, 7), O ^= W(te + B | 0, 9), ee ^= W(O + te | 0, 13), B ^= W(ee + O | 0, 18), j ^= W(ce + L | 0, 7), ne ^= W(j + ce | 0, 9), L ^= W(ne + j | 0, 13), ce ^= W(L + ne | 0, 18), T ^= W(P + j | 0, 7), O ^= W(T + P | 0, 9), j ^= W(O + T | 0, 13), P ^= W(j + O | 0, 18), ee ^= W(F + $ | 0, 7), ne ^= W(ee + F | 0, 9), $ ^= W(ne + ee | 0, 13), F ^= W($ + ne | 0, 18), L ^= W(B + A | 0, 7), be ^= W(L + B | 0, 9), A ^= W(be + L | 0, 13), B ^= W(A + be | 0, 18), V ^= W(ce + te | 0, 7), M ^= W(V + ce | 0, 9), te ^= W(M + V | 0, 13), ce ^= W(te + M | 0, 18);
  s[i++] = a + P | 0, s[i++] = o + T | 0, s[i++] = c + O | 0, s[i++] = f + j | 0, s[i++] = d + $ | 0, s[i++] = l + F | 0, s[i++] = x + ee | 0, s[i++] = p + ne | 0, s[i++] = b + be | 0, s[i++] = h + A | 0, s[i++] = m + B | 0, s[i++] = y + L | 0, s[i++] = I + V | 0, s[i++] = E + M | 0, s[i++] = C + te | 0, s[i++] = S + ce | 0;
}
function Wn(n31, e, t, r, s) {
  let i = r + 0, a = r + 16 * s;
  for (let o = 0; o < 16; o++) t[a + o] = n31[e + (2 * s - 1) * 16 + o];
  for (let o = 0; o < s; o++, i += 16, e += 16) fo(t, a, n31, e, t, i), o > 0 && (a += 16), fo(t, i, n31, e += 16, t, a);
}
function lo(n31, e, t) {
  let r = Qr({ dkLen: 32, asyncTick: 10, maxmem: 1073742848 }, t), { N: s, r: i, p: a, dkLen: o, asyncTick: c, maxmem: f, onProgress: d } = r;
  if (Ie(s), Ie(i), Ie(a), Ie(o), Ie(c), Ie(f), d !== void 0 && typeof d != "function") throw new Error("progressCb should be function");
  let l = 128 * i, x = l / 4;
  if (s <= 1 || (s & s - 1) !== 0 || s >= 2 ** (l / 8) || s > 2 ** 32) throw new Error("Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32");
  if (a < 0 || a > (2 ** 32 - 1) * 32 / l) throw new Error("Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)");
  if (o < 0 || o > (2 ** 32 - 1) * 32) throw new Error("Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32");
  let p = l * (s + a);
  if (p > f) throw new Error(`Scrypt: parameters too large, ${p} (128 * r * (N + p)) > ${f} (maxmem)`);
  let b = hr(wt, n31, e, { c: 1, dkLen: l * a }), h = Vn(b), m = Vn(new Uint8Array(l * s)), y = Vn(new Uint8Array(l)), I = () => {
  };
  if (d) {
    let E = 2 * s * a, C = Math.max(Math.floor(E / 1e4), 1), S = 0;
    I = () => {
      S++, d && (!(S % C) || S === E) && d(S / E);
    };
  }
  return { N: s, r: i, p: a, dkLen: o, blockSize32: x, V: m, B32: h, B: b, tmp: y, blockMixCb: I, asyncTick: c };
}
function uo(n31, e, t, r, s) {
  let i = hr(wt, n31, t, { c: 1, dkLen: e });
  return t.fill(0), r.fill(0), s.fill(0), i;
}
function xo(n31, e, t) {
  let { N: r, r: s, p: i, dkLen: a, blockSize32: o, V: c, B32: f, B: d, tmp: l, blockMixCb: x } = lo(n31, e, t);
  for (let p = 0; p < i; p++) {
    let b = o * p;
    for (let h = 0; h < o; h++) c[h] = f[b + h];
    for (let h = 0, m = 0; h < r - 1; h++) Wn(c, m, c, m += o, s), x();
    Wn(c, (r - 1) * o, f, b, s), x();
    for (let h = 0; h < r; h++) {
      let m = f[b + o - 16] % r;
      for (let y = 0; y < o; y++) l[y] = f[b + y] ^ c[m * o + y];
      Wn(l, 0, f, b, s), x();
    }
  }
  return uo(n31, a, d, c, l);
}
async function ho(n31, e, t) {
  let { N: r, r: s, p: i, dkLen: a, blockSize32: o, V: c, B32: f, B: d, tmp: l, blockMixCb: x, asyncTick: p } = lo(n31, e, t);
  for (let b = 0; b < i; b++) {
    let h = o * b;
    for (let y = 0; y < o; y++) c[y] = f[h + y];
    let m = 0;
    await Xr(r - 1, p, () => {
      Wn(c, m, c, m += o, s), x();
    }), Wn(c, (r - 1) * o, f, h, s), x(), await Xr(r, p, () => {
      let y = f[h + o - 16] % r;
      for (let I = 0; I < o; I++) l[I] = f[h + I] ^ c[y * o + I];
      Wn(l, 0, f, h, s), x();
    });
  }
  return uo(n31, a, d, c, l);
}
var po = false, bo = false, mo = async function(n31, e, t, r, s, i, a) {
  return await ho(n31, e, { N: t, r, p: s, dkLen: i, onProgress: a });
}, go = function(n31, e, t, r, s, i) {
  return xo(n31, e, { N: t, r, p: s, dkLen: i });
}, yo = mo, wo = go;
async function At(n31, e, t, r, s, i, a) {
  let o = v(n31, "passwd"), c = v(e, "salt");
  return g(await yo(o, c, t, r, s, i, a));
}
At._ = mo;
At.lock = function() {
  bo = true;
};
At.register = function(n31) {
  if (bo) throw new Error("scrypt is locked");
  yo = n31;
};
Object.freeze(At);
function It(n31, e, t, r, s, i) {
  let a = v(n31, "passwd"), o = v(e, "salt");
  return g(wo(a, o, t, r, s, i));
}
It._ = go;
It.lock = function() {
  po = true;
};
It.register = function(n31) {
  if (po) throw new Error("scryptSync is locked");
  wo = n31;
};
Object.freeze(It);
var vo = function(n31) {
  return ci("sha256").update(n31).digest();
}, Eo = function(n31) {
  return ci("sha512").update(n31).digest();
}, Ao = vo, Io = Eo, ko = false, So = false;
function ue(n31) {
  let e = v(n31, "data");
  return g(Ao(e));
}
ue._ = vo;
ue.lock = function() {
  ko = true;
};
ue.register = function(n31) {
  if (ko) throw new Error("sha256 is locked");
  Ao = n31;
};
Object.freeze(ue);
function br(n31) {
  let e = v(n31, "data");
  return g(Io(e));
}
br._ = Eo;
br.lock = function() {
  So = true;
};
br.register = function(n31) {
  if (So) throw new Error("sha512 is locked");
  Io = n31;
};
Object.freeze(ue);
var pi = {};
oc(pi, { bitGet: () => Af, bitLen: () => Ef, bitMask: () => mr, bitSet: () => If, bytesToHex: () => un, bytesToNumberBE: () => kt, bytesToNumberLE: () => cs, concatBytes: () => Jn, createHmacDrbg: () => hi, ensureBytes: () => $e, equalBytes: () => wf, hexToBytes: () => xn, hexToNumber: () => xi, numberToBytesBE: () => qt, numberToBytesLE: () => fs, numberToHexUnpadded: () => No, numberToVarBytesBE: () => yf, utf8ToBytes: () => vf, validateObject: () => jt });
var Po = BigInt(0), as = BigInt(1), mf = BigInt(2), os = (n31) => n31 instanceof Uint8Array, gf = Array.from({ length: 256 }, (n31, e) => e.toString(16).padStart(2, "0"));
function un(n31) {
  if (!os(n31)) throw new Error("Uint8Array expected");
  let e = "";
  for (let t = 0; t < n31.length; t++) e += gf[n31[t]];
  return e;
}
function No(n31) {
  let e = n31.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function xi(n31) {
  if (typeof n31 != "string") throw new Error("hex string expected, got " + typeof n31);
  return BigInt(n31 === "" ? "0" : `0x${n31}`);
}
function xn(n31) {
  if (typeof n31 != "string") throw new Error("hex string expected, got " + typeof n31);
  let e = n31.length;
  if (e % 2) throw new Error("padded hex string expected, got unpadded hex of length " + e);
  let t = new Uint8Array(e / 2);
  for (let r = 0; r < t.length; r++) {
    let s = r * 2, i = n31.slice(s, s + 2), a = Number.parseInt(i, 16);
    if (Number.isNaN(a) || a < 0) throw new Error("Invalid byte sequence");
    t[r] = a;
  }
  return t;
}
function kt(n31) {
  return xi(un(n31));
}
function cs(n31) {
  if (!os(n31)) throw new Error("Uint8Array expected");
  return xi(un(Uint8Array.from(n31).reverse()));
}
function qt(n31, e) {
  return xn(n31.toString(16).padStart(e * 2, "0"));
}
function fs(n31, e) {
  return qt(n31, e).reverse();
}
function yf(n31) {
  return xn(No(n31));
}
function $e(n31, e, t) {
  let r;
  if (typeof e == "string") try {
    r = xn(e);
  } catch (i) {
    throw new Error(`${n31} must be valid hex string, got "${e}". Cause: ${i}`);
  }
  else if (os(e)) r = Uint8Array.from(e);
  else throw new Error(`${n31} must be hex string or Uint8Array`);
  let s = r.length;
  if (typeof t == "number" && s !== t) throw new Error(`${n31} expected ${t} bytes, got ${s}`);
  return r;
}
function Jn(...n31) {
  let e = new Uint8Array(n31.reduce((r, s) => r + s.length, 0)), t = 0;
  return n31.forEach((r) => {
    if (!os(r)) throw new Error("Uint8Array expected");
    e.set(r, t), t += r.length;
  }), e;
}
function wf(n31, e) {
  if (n31.length !== e.length) return false;
  for (let t = 0; t < n31.length; t++) if (n31[t] !== e[t]) return false;
  return true;
}
function vf(n31) {
  if (typeof n31 != "string") throw new Error(`utf8ToBytes expected string, got ${typeof n31}`);
  return new Uint8Array(new TextEncoder().encode(n31));
}
function Ef(n31) {
  let e;
  for (e = 0; n31 > Po; n31 >>= as, e += 1) ;
  return e;
}
function Af(n31, e) {
  return n31 >> BigInt(e) & as;
}
var If = (n31, e, t) => n31 | (t ? as : Po) << BigInt(e), mr = (n31) => (mf << BigInt(n31 - 1)) - as, ui = (n31) => new Uint8Array(n31), Bo = (n31) => Uint8Array.from(n31);
function hi(n31, e, t) {
  if (typeof n31 != "number" || n31 < 2) throw new Error("hashLen must be a number");
  if (typeof e != "number" || e < 2) throw new Error("qByteLen must be a number");
  if (typeof t != "function") throw new Error("hmacFn must be a function");
  let r = ui(n31), s = ui(n31), i = 0, a = () => {
    r.fill(1), s.fill(0), i = 0;
  }, o = (...l) => t(s, r, ...l), c = (l = ui()) => {
    s = o(Bo([0]), l), r = o(), l.length !== 0 && (s = o(Bo([1]), l), r = o());
  }, f = () => {
    if (i++ >= 1e3) throw new Error("drbg: tried 1000 values");
    let l = 0, x = [];
    for (; l < e; ) {
      r = o();
      let p = r.slice();
      x.push(p), l += r.length;
    }
    return Jn(...x);
  };
  return (l, x) => {
    a(), c(l);
    let p;
    for (; !(p = x(f())); ) c();
    return a(), p;
  };
}
var kf = { bigint: (n31) => typeof n31 == "bigint", function: (n31) => typeof n31 == "function", boolean: (n31) => typeof n31 == "boolean", string: (n31) => typeof n31 == "string", stringOrUint8Array: (n31) => typeof n31 == "string" || n31 instanceof Uint8Array, isSafeInteger: (n31) => Number.isSafeInteger(n31), array: (n31) => Array.isArray(n31), field: (n31, e) => e.Fp.isValid(n31), hash: (n31) => typeof n31 == "function" && Number.isSafeInteger(n31.outputLen) };
function jt(n31, e, t = {}) {
  let r = (s, i, a) => {
    let o = kf[i];
    if (typeof o != "function") throw new Error(`Invalid validator "${i}", expected function`);
    let c = n31[s];
    if (!(a && c === void 0) && !o(c, n31)) throw new Error(`Invalid param ${String(s)}=${c} (${typeof c}), expected ${i}`);
  };
  for (let [s, i] of Object.entries(e)) r(s, i, false);
  for (let [s, i] of Object.entries(t)) r(s, i, true);
  return n31;
}
var pe = BigInt(0), oe = BigInt(1), hn = BigInt(2), Sf = BigInt(3), bi = BigInt(4), To = BigInt(5), Ro = BigInt(8), Bf = BigInt(9), Pf = BigInt(16);
function ke(n31, e) {
  let t = n31 % e;
  return t >= pe ? t : e + t;
}
function Nf(n31, e, t) {
  if (t <= pe || e < pe) throw new Error("Expected power/modulo > 0");
  if (t === oe) return pe;
  let r = oe;
  for (; e > pe; ) e & oe && (r = r * n31 % t), n31 = n31 * n31 % t, e >>= oe;
  return r;
}
function Me(n31, e, t) {
  let r = n31;
  for (; e-- > pe; ) r *= r, r %= t;
  return r;
}
function ls(n31, e) {
  if (n31 === pe || e <= pe) throw new Error(`invert: expected positive integers, got n=${n31} mod=${e}`);
  let t = ke(n31, e), r = e, s = pe, i = oe, a = oe, o = pe;
  for (; t !== pe; ) {
    let f = r / t, d = r % t, l = s - a * f, x = i - o * f;
    r = t, t = d, s = a, i = o, a = l, o = x;
  }
  if (r !== oe) throw new Error("invert: does not exist");
  return ke(s, e);
}
function Tf(n31) {
  let e = (n31 - oe) / hn, t, r, s;
  for (t = n31 - oe, r = 0; t % hn === pe; t /= hn, r++) ;
  for (s = hn; s < n31 && Nf(s, e, n31) !== n31 - oe; s++) ;
  if (r === 1) {
    let a = (n31 + oe) / bi;
    return function(c, f) {
      let d = c.pow(f, a);
      if (!c.eql(c.sqr(d), f)) throw new Error("Cannot find square root");
      return d;
    };
  }
  let i = (t + oe) / hn;
  return function(o, c) {
    if (o.pow(c, e) === o.neg(o.ONE)) throw new Error("Cannot find square root");
    let f = r, d = o.pow(o.mul(o.ONE, s), t), l = o.pow(c, i), x = o.pow(c, t);
    for (; !o.eql(x, o.ONE); ) {
      if (o.eql(x, o.ZERO)) return o.ZERO;
      let p = 1;
      for (let h = o.sqr(x); p < f && !o.eql(h, o.ONE); p++) h = o.sqr(h);
      let b = o.pow(d, oe << BigInt(f - p - 1));
      d = o.sqr(b), l = o.mul(l, b), x = o.mul(x, d), f = p;
    }
    return l;
  };
}
function Rf(n31) {
  if (n31 % bi === Sf) {
    let e = (n31 + oe) / bi;
    return function(r, s) {
      let i = r.pow(s, e);
      if (!r.eql(r.sqr(i), s)) throw new Error("Cannot find square root");
      return i;
    };
  }
  if (n31 % Ro === To) {
    let e = (n31 - To) / Ro;
    return function(r, s) {
      let i = r.mul(s, hn), a = r.pow(i, e), o = r.mul(s, a), c = r.mul(r.mul(o, hn), a), f = r.mul(o, r.sub(c, r.ONE));
      if (!r.eql(r.sqr(f), s)) throw new Error("Cannot find square root");
      return f;
    };
  }
  return n31 % Pf, Tf(n31);
}
var Of = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
function mi(n31) {
  let e = { ORDER: "bigint", MASK: "bigint", BYTES: "isSafeInteger", BITS: "isSafeInteger" }, t = Of.reduce((r, s) => (r[s] = "function", r), e);
  return jt(n31, t);
}
function Cf(n31, e, t) {
  if (t < pe) throw new Error("Expected power > 0");
  if (t === pe) return n31.ONE;
  if (t === oe) return e;
  let r = n31.ONE, s = e;
  for (; t > pe; ) t & oe && (r = n31.mul(r, s)), s = n31.sqr(s), t >>= oe;
  return r;
}
function Lf(n31, e) {
  let t = new Array(e.length), r = e.reduce((i, a, o) => n31.is0(a) ? i : (t[o] = i, n31.mul(i, a)), n31.ONE), s = n31.inv(r);
  return e.reduceRight((i, a, o) => n31.is0(a) ? i : (t[o] = n31.mul(i, t[o]), n31.mul(i, a)), s), t;
}
function gi(n31, e) {
  let t = e !== void 0 ? e : n31.toString(2).length, r = Math.ceil(t / 8);
  return { nBitLength: t, nByteLength: r };
}
function Oo(n31, e, t = false, r = {}) {
  if (n31 <= pe) throw new Error(`Expected Field ORDER > 0, got ${n31}`);
  let { nBitLength: s, nByteLength: i } = gi(n31, e);
  if (i > 2048) throw new Error("Field lengths over 2048 bytes are not supported");
  let a = Rf(n31), o = Object.freeze({ ORDER: n31, BITS: s, BYTES: i, MASK: mr(s), ZERO: pe, ONE: oe, create: (c) => ke(c, n31), isValid: (c) => {
    if (typeof c != "bigint") throw new Error(`Invalid field element: expected bigint, got ${typeof c}`);
    return pe <= c && c < n31;
  }, is0: (c) => c === pe, isOdd: (c) => (c & oe) === oe, neg: (c) => ke(-c, n31), eql: (c, f) => c === f, sqr: (c) => ke(c * c, n31), add: (c, f) => ke(c + f, n31), sub: (c, f) => ke(c - f, n31), mul: (c, f) => ke(c * f, n31), pow: (c, f) => Cf(o, c, f), div: (c, f) => ke(c * ls(f, n31), n31), sqrN: (c) => c * c, addN: (c, f) => c + f, subN: (c, f) => c - f, mulN: (c, f) => c * f, inv: (c) => ls(c, n31), sqrt: r.sqrt || ((c) => a(o, c)), invertBatch: (c) => Lf(o, c), cmov: (c, f, d) => d ? f : c, toBytes: (c) => t ? fs(c, i) : qt(c, i), fromBytes: (c) => {
    if (c.length !== i) throw new Error(`Fp.fromBytes: expected ${i}, got ${c.length}`);
    return t ? cs(c) : kt(c);
  } });
  return Object.freeze(o);
}
function Co(n31) {
  if (typeof n31 != "bigint") throw new Error("field order must be bigint");
  let e = n31.toString(2).length;
  return Math.ceil(e / 8);
}
function yi(n31) {
  let e = Co(n31);
  return e + Math.ceil(e / 2);
}
function Lo(n31, e, t = false) {
  let r = n31.length, s = Co(e), i = yi(e);
  if (r < 16 || r < i || r > 1024) throw new Error(`expected ${i}-1024 bytes of input, got ${r}`);
  let a = t ? kt(n31) : cs(n31), o = ke(a, e - oe) + oe;
  return t ? fs(o, s) : qt(o, s);
}
var Df = BigInt(0), wi = BigInt(1);
function Uo(n31, e) {
  let t = (s, i) => {
    let a = i.negate();
    return s ? a : i;
  }, r = (s) => {
    let i = Math.ceil(e / s) + 1, a = 2 ** (s - 1);
    return { windows: i, windowSize: a };
  };
  return { constTimeNegate: t, unsafeLadder(s, i) {
    let a = n31.ZERO, o = s;
    for (; i > Df; ) i & wi && (a = a.add(o)), o = o.double(), i >>= wi;
    return a;
  }, precomputeWindow(s, i) {
    let { windows: a, windowSize: o } = r(i), c = [], f = s, d = f;
    for (let l = 0; l < a; l++) {
      d = f, c.push(d);
      for (let x = 1; x < o; x++) d = d.add(f), c.push(d);
      f = d.double();
    }
    return c;
  }, wNAF(s, i, a) {
    let { windows: o, windowSize: c } = r(s), f = n31.ZERO, d = n31.BASE, l = BigInt(2 ** s - 1), x = 2 ** s, p = BigInt(s);
    for (let b = 0; b < o; b++) {
      let h = b * c, m = Number(a & l);
      a >>= p, m > c && (m -= x, a += wi);
      let y = h, I = h + Math.abs(m) - 1, E = b % 2 !== 0, C = m < 0;
      m === 0 ? d = d.add(t(E, i[y])) : f = f.add(t(C, i[I]));
    }
    return { p: f, f: d };
  }, wNAFCached(s, i, a, o) {
    let c = s._WINDOW_SIZE || 1, f = i.get(s);
    return f || (f = this.precomputeWindow(s, c), c !== 1 && i.set(s, o(f))), this.wNAF(c, f, a);
  } };
}
function vi(n31) {
  return mi(n31.Fp), jt(n31, { n: "bigint", h: "bigint", Gx: "field", Gy: "field" }, { nBitLength: "isSafeInteger", nByteLength: "isSafeInteger" }), Object.freeze({ ...gi(n31.n, n31.nBitLength), ...n31, p: n31.Fp.ORDER });
}
function Ff(n31) {
  let e = vi(n31);
  jt(e, { a: "field", b: "field" }, { allowedPrivateKeyLengths: "array", wrapPrivateKey: "boolean", isTorsionFree: "function", clearCofactor: "function", allowInfinityPoint: "boolean", fromBytes: "function", toBytes: "function" });
  let { endo: t, Fp: r, a: s } = e;
  if (t) {
    if (!r.eql(s, r.ZERO)) throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
    if (typeof t != "object" || typeof t.beta != "bigint" || typeof t.splitScalar != "function") throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
  }
  return Object.freeze({ ...e });
}
var { bytesToNumberBE: Gf, hexToBytes: _f } = pi, pn = { Err: class extends Error {
  constructor(e = "") {
    super(e);
  }
}, _parseInt(n31) {
  let { Err: e } = pn;
  if (n31.length < 2 || n31[0] !== 2) throw new e("Invalid signature integer tag");
  let t = n31[1], r = n31.subarray(2, t + 2);
  if (!t || r.length !== t) throw new e("Invalid signature integer: wrong length");
  if (r[0] & 128) throw new e("Invalid signature integer: negative");
  if (r[0] === 0 && !(r[1] & 128)) throw new e("Invalid signature integer: unnecessary leading zero");
  return { d: Gf(r), l: n31.subarray(t + 2) };
}, toSig(n31) {
  let { Err: e } = pn, t = typeof n31 == "string" ? _f(n31) : n31;
  if (!(t instanceof Uint8Array)) throw new Error("ui8a expected");
  let r = t.length;
  if (r < 2 || t[0] != 48) throw new e("Invalid signature tag");
  if (t[1] !== r - 2) throw new e("Invalid signature: incorrect length");
  let { d: s, l: i } = pn._parseInt(t.subarray(2)), { d: a, l: o } = pn._parseInt(i);
  if (o.length) throw new e("Invalid signature: left bytes after parsing");
  return { r: s, s: a };
}, hexFromSig(n31) {
  let e = (f) => Number.parseInt(f[0], 16) & 8 ? "00" + f : f, t = (f) => {
    let d = f.toString(16);
    return d.length & 1 ? `0${d}` : d;
  }, r = e(t(n31.s)), s = e(t(n31.r)), i = r.length / 2, a = s.length / 2, o = t(i), c = t(a);
  return `30${t(a + i + 4)}02${c}${s}02${o}${r}`;
} }, St = BigInt(0), Je = BigInt(1), Vx = BigInt(2), Do = BigInt(3), Kx = BigInt(4);
function $f(n31) {
  let e = Ff(n31), { Fp: t } = e, r = e.toBytes || ((b, h, m) => {
    let y = h.toAffine();
    return Jn(Uint8Array.from([4]), t.toBytes(y.x), t.toBytes(y.y));
  }), s = e.fromBytes || ((b) => {
    let h = b.subarray(1), m = t.fromBytes(h.subarray(0, t.BYTES)), y = t.fromBytes(h.subarray(t.BYTES, 2 * t.BYTES));
    return { x: m, y };
  });
  function i(b) {
    let { a: h, b: m } = e, y = t.sqr(b), I = t.mul(y, b);
    return t.add(t.add(I, t.mul(b, h)), m);
  }
  if (!t.eql(t.sqr(e.Gy), i(e.Gx))) throw new Error("bad generator point: equation left != right");
  function a(b) {
    return typeof b == "bigint" && St < b && b < e.n;
  }
  function o(b) {
    if (!a(b)) throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function c(b) {
    let { allowedPrivateKeyLengths: h, nByteLength: m, wrapPrivateKey: y, n: I } = e;
    if (h && typeof b != "bigint") {
      if (b instanceof Uint8Array && (b = un(b)), typeof b != "string" || !h.includes(b.length)) throw new Error("Invalid key");
      b = b.padStart(m * 2, "0");
    }
    let E;
    try {
      E = typeof b == "bigint" ? b : kt($e("private key", b, m));
    } catch {
      throw new Error(`private key must be ${m} bytes, hex or bigint, not ${typeof b}`);
    }
    return y && (E = ke(E, I)), o(E), E;
  }
  let f = /* @__PURE__ */ new Map();
  function d(b) {
    if (!(b instanceof l)) throw new Error("ProjectivePoint expected");
  }
  class l {
    constructor(h, m, y) {
      if (this.px = h, this.py = m, this.pz = y, h == null || !t.isValid(h)) throw new Error("x required");
      if (m == null || !t.isValid(m)) throw new Error("y required");
      if (y == null || !t.isValid(y)) throw new Error("z required");
    }
    static fromAffine(h) {
      let { x: m, y } = h || {};
      if (!h || !t.isValid(m) || !t.isValid(y)) throw new Error("invalid affine point");
      if (h instanceof l) throw new Error("projective point not allowed");
      let I = (E) => t.eql(E, t.ZERO);
      return I(m) && I(y) ? l.ZERO : new l(m, y, t.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ(h) {
      let m = t.invertBatch(h.map((y) => y.pz));
      return h.map((y, I) => y.toAffine(m[I])).map(l.fromAffine);
    }
    static fromHex(h) {
      let m = l.fromAffine(s($e("pointHex", h)));
      return m.assertValidity(), m;
    }
    static fromPrivateKey(h) {
      return l.BASE.multiply(c(h));
    }
    _setWindowSize(h) {
      this._WINDOW_SIZE = h, f.delete(this);
    }
    assertValidity() {
      if (this.is0()) {
        if (e.allowInfinityPoint && !t.is0(this.py)) return;
        throw new Error("bad point: ZERO");
      }
      let { x: h, y: m } = this.toAffine();
      if (!t.isValid(h) || !t.isValid(m)) throw new Error("bad point: x or y not FE");
      let y = t.sqr(m), I = i(h);
      if (!t.eql(y, I)) throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      let { y: h } = this.toAffine();
      if (t.isOdd) return !t.isOdd(h);
      throw new Error("Field doesn't support isOdd");
    }
    equals(h) {
      d(h);
      let { px: m, py: y, pz: I } = this, { px: E, py: C, pz: S } = h, P = t.eql(t.mul(m, S), t.mul(E, I)), T = t.eql(t.mul(y, S), t.mul(C, I));
      return P && T;
    }
    negate() {
      return new l(this.px, t.neg(this.py), this.pz);
    }
    double() {
      let { a: h, b: m } = e, y = t.mul(m, Do), { px: I, py: E, pz: C } = this, S = t.ZERO, P = t.ZERO, T = t.ZERO, O = t.mul(I, I), j = t.mul(E, E), $ = t.mul(C, C), F = t.mul(I, E);
      return F = t.add(F, F), T = t.mul(I, C), T = t.add(T, T), S = t.mul(h, T), P = t.mul(y, $), P = t.add(S, P), S = t.sub(j, P), P = t.add(j, P), P = t.mul(S, P), S = t.mul(F, S), T = t.mul(y, T), $ = t.mul(h, $), F = t.sub(O, $), F = t.mul(h, F), F = t.add(F, T), T = t.add(O, O), O = t.add(T, O), O = t.add(O, $), O = t.mul(O, F), P = t.add(P, O), $ = t.mul(E, C), $ = t.add($, $), O = t.mul($, F), S = t.sub(S, O), T = t.mul($, j), T = t.add(T, T), T = t.add(T, T), new l(S, P, T);
    }
    add(h) {
      d(h);
      let { px: m, py: y, pz: I } = this, { px: E, py: C, pz: S } = h, P = t.ZERO, T = t.ZERO, O = t.ZERO, j = e.a, $ = t.mul(e.b, Do), F = t.mul(m, E), ee = t.mul(y, C), ne = t.mul(I, S), be = t.add(m, y), A = t.add(E, C);
      be = t.mul(be, A), A = t.add(F, ee), be = t.sub(be, A), A = t.add(m, I);
      let B = t.add(E, S);
      return A = t.mul(A, B), B = t.add(F, ne), A = t.sub(A, B), B = t.add(y, I), P = t.add(C, S), B = t.mul(B, P), P = t.add(ee, ne), B = t.sub(B, P), O = t.mul(j, A), P = t.mul($, ne), O = t.add(P, O), P = t.sub(ee, O), O = t.add(ee, O), T = t.mul(P, O), ee = t.add(F, F), ee = t.add(ee, F), ne = t.mul(j, ne), A = t.mul($, A), ee = t.add(ee, ne), ne = t.sub(F, ne), ne = t.mul(j, ne), A = t.add(A, ne), F = t.mul(ee, A), T = t.add(T, F), F = t.mul(B, A), P = t.mul(be, P), P = t.sub(P, F), F = t.mul(be, ee), O = t.mul(B, O), O = t.add(O, F), new l(P, T, O);
    }
    subtract(h) {
      return this.add(h.negate());
    }
    is0() {
      return this.equals(l.ZERO);
    }
    wNAF(h) {
      return p.wNAFCached(this, f, h, (m) => {
        let y = t.invertBatch(m.map((I) => I.pz));
        return m.map((I, E) => I.toAffine(y[E])).map(l.fromAffine);
      });
    }
    multiplyUnsafe(h) {
      let m = l.ZERO;
      if (h === St) return m;
      if (o(h), h === Je) return this;
      let { endo: y } = e;
      if (!y) return p.unsafeLadder(this, h);
      let { k1neg: I, k1: E, k2neg: C, k2: S } = y.splitScalar(h), P = m, T = m, O = this;
      for (; E > St || S > St; ) E & Je && (P = P.add(O)), S & Je && (T = T.add(O)), O = O.double(), E >>= Je, S >>= Je;
      return I && (P = P.negate()), C && (T = T.negate()), T = new l(t.mul(T.px, y.beta), T.py, T.pz), P.add(T);
    }
    multiply(h) {
      o(h);
      let m = h, y, I, { endo: E } = e;
      if (E) {
        let { k1neg: C, k1: S, k2neg: P, k2: T } = E.splitScalar(m), { p: O, f: j } = this.wNAF(S), { p: $, f: F } = this.wNAF(T);
        O = p.constTimeNegate(C, O), $ = p.constTimeNegate(P, $), $ = new l(t.mul($.px, E.beta), $.py, $.pz), y = O.add($), I = j.add(F);
      } else {
        let { p: C, f: S } = this.wNAF(m);
        y = C, I = S;
      }
      return l.normalizeZ([y, I])[0];
    }
    multiplyAndAddUnsafe(h, m, y) {
      let I = l.BASE, E = (S, P) => P === St || P === Je || !S.equals(I) ? S.multiplyUnsafe(P) : S.multiply(P), C = E(this, m).add(E(h, y));
      return C.is0() ? void 0 : C;
    }
    toAffine(h) {
      let { px: m, py: y, pz: I } = this, E = this.is0();
      h == null && (h = E ? t.ONE : t.inv(I));
      let C = t.mul(m, h), S = t.mul(y, h), P = t.mul(I, h);
      if (E) return { x: t.ZERO, y: t.ZERO };
      if (!t.eql(P, t.ONE)) throw new Error("invZ was invalid");
      return { x: C, y: S };
    }
    isTorsionFree() {
      let { h, isTorsionFree: m } = e;
      if (h === Je) return true;
      if (m) return m(l, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      let { h, clearCofactor: m } = e;
      return h === Je ? this : m ? m(l, this) : this.multiplyUnsafe(e.h);
    }
    toRawBytes(h = true) {
      return this.assertValidity(), r(l, this, h);
    }
    toHex(h = true) {
      return un(this.toRawBytes(h));
    }
  }
  l.BASE = new l(e.Gx, e.Gy, t.ONE), l.ZERO = new l(t.ZERO, t.ONE, t.ZERO);
  let x = e.nBitLength, p = Uo(l, e.endo ? Math.ceil(x / 2) : x);
  return { CURVE: e, ProjectivePoint: l, normPrivateKeyToScalar: c, weierstrassEquation: i, isWithinCurveOrder: a };
}
function Mf(n31) {
  let e = vi(n31);
  return jt(e, { hash: "hash", hmac: "function", randomBytes: "function" }, { bits2int: "function", bits2int_modN: "function", lowS: "boolean" }), Object.freeze({ lowS: true, ...e });
}
function Fo(n31) {
  let e = Mf(n31), { Fp: t, n: r } = e, s = t.BYTES + 1, i = 2 * t.BYTES + 1;
  function a(A) {
    return St < A && A < t.ORDER;
  }
  function o(A) {
    return ke(A, r);
  }
  function c(A) {
    return ls(A, r);
  }
  let { ProjectivePoint: f, normPrivateKeyToScalar: d, weierstrassEquation: l, isWithinCurveOrder: x } = $f({ ...e, toBytes(A, B, L) {
    let V = B.toAffine(), M = t.toBytes(V.x), te = Jn;
    return L ? te(Uint8Array.from([B.hasEvenY() ? 2 : 3]), M) : te(Uint8Array.from([4]), M, t.toBytes(V.y));
  }, fromBytes(A) {
    let B = A.length, L = A[0], V = A.subarray(1);
    if (B === s && (L === 2 || L === 3)) {
      let M = kt(V);
      if (!a(M)) throw new Error("Point is not on curve");
      let te = l(M), ce = t.sqrt(te), Ee = (ce & Je) === Je;
      return (L & 1) === 1 !== Ee && (ce = t.neg(ce)), { x: M, y: ce };
    } else if (B === i && L === 4) {
      let M = t.fromBytes(V.subarray(0, t.BYTES)), te = t.fromBytes(V.subarray(t.BYTES, 2 * t.BYTES));
      return { x: M, y: te };
    } else throw new Error(`Point of length ${B} was invalid. Expected ${s} compressed bytes or ${i} uncompressed bytes`);
  } }), p = (A) => un(qt(A, e.nByteLength));
  function b(A) {
    let B = r >> Je;
    return A > B;
  }
  function h(A) {
    return b(A) ? o(-A) : A;
  }
  let m = (A, B, L) => kt(A.slice(B, L));
  class y {
    constructor(B, L, V) {
      this.r = B, this.s = L, this.recovery = V, this.assertValidity();
    }
    static fromCompact(B) {
      let L = e.nByteLength;
      return B = $e("compactSignature", B, L * 2), new y(m(B, 0, L), m(B, L, 2 * L));
    }
    static fromDER(B) {
      let { r: L, s: V } = pn.toSig($e("DER", B));
      return new y(L, V);
    }
    assertValidity() {
      if (!x(this.r)) throw new Error("r must be 0 < r < CURVE.n");
      if (!x(this.s)) throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit(B) {
      return new y(this.r, this.s, B);
    }
    recoverPublicKey(B) {
      let { r: L, s: V, recovery: M } = this, te = T($e("msgHash", B));
      if (M == null || ![0, 1, 2, 3].includes(M)) throw new Error("recovery id invalid");
      let ce = M === 2 || M === 3 ? L + e.n : L;
      if (ce >= t.ORDER) throw new Error("recovery id 2 or 3 invalid");
      let Ee = (M & 1) === 0 ? "02" : "03", Lt = f.fromHex(Ee + p(ce)), Ut = c(ce), Nn = o(-te * Ut), or = o(V * Ut), Dt = f.BASE.multiplyAndAddUnsafe(Lt, Nn, or);
      if (!Dt) throw new Error("point at infinify");
      return Dt.assertValidity(), Dt;
    }
    hasHighS() {
      return b(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new y(this.r, o(-this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return xn(this.toDERHex());
    }
    toDERHex() {
      return pn.hexFromSig({ r: this.r, s: this.s });
    }
    toCompactRawBytes() {
      return xn(this.toCompactHex());
    }
    toCompactHex() {
      return p(this.r) + p(this.s);
    }
  }
  let I = { isValidPrivateKey(A) {
    try {
      return d(A), true;
    } catch {
      return false;
    }
  }, normPrivateKeyToScalar: d, randomPrivateKey: () => {
    let A = yi(e.n);
    return Lo(e.randomBytes(A), e.n);
  }, precompute(A = 8, B = f.BASE) {
    return B._setWindowSize(A), B.multiply(BigInt(3)), B;
  } };
  function E(A, B = true) {
    return f.fromPrivateKey(A).toRawBytes(B);
  }
  function C(A) {
    let B = A instanceof Uint8Array, L = typeof A == "string", V = (B || L) && A.length;
    return B ? V === s || V === i : L ? V === 2 * s || V === 2 * i : A instanceof f;
  }
  function S(A, B, L = true) {
    if (C(A)) throw new Error("first arg must be private key");
    if (!C(B)) throw new Error("second arg must be public key");
    return f.fromHex(B).multiply(d(A)).toRawBytes(L);
  }
  let P = e.bits2int || function(A) {
    let B = kt(A), L = A.length * 8 - e.nBitLength;
    return L > 0 ? B >> BigInt(L) : B;
  }, T = e.bits2int_modN || function(A) {
    return o(P(A));
  }, O = mr(e.nBitLength);
  function j(A) {
    if (typeof A != "bigint") throw new Error("bigint expected");
    if (!(St <= A && A < O)) throw new Error(`bigint expected < 2^${e.nBitLength}`);
    return qt(A, e.nByteLength);
  }
  function $(A, B, L = F) {
    if (["recovered", "canonical"].some((on) => on in L)) throw new Error("sign() legacy options not supported");
    let { hash: V, randomBytes: M } = e, { lowS: te, prehash: ce, extraEntropy: Ee } = L;
    te == null && (te = true), A = $e("msgHash", A), ce && (A = $e("prehashed msgHash", V(A)));
    let Lt = T(A), Ut = d(B), Nn = [j(Ut), j(Lt)];
    if (Ee != null) {
      let on = Ee === true ? M(t.BYTES) : Ee;
      Nn.push($e("extraEntropy", on));
    }
    let or = Jn(...Nn), Dt = Lt;
    function qs(on) {
      let Tn = P(on);
      if (!x(Tn)) return;
      let fa = c(Tn), ft = f.BASE.multiply(Tn).toAffine(), Rn = o(ft.x);
      if (Rn === St) return;
      let Dr = o(fa * o(Dt + Rn * Ut));
      if (Dr === St) return;
      let la = (ft.x === Rn ? 0 : 2) | Number(ft.y & Je), da = Dr;
      return te && b(Dr) && (da = h(Dr), la ^= 1), new y(Rn, da, la);
    }
    return { seed: or, k2sig: qs };
  }
  let F = { lowS: e.lowS, prehash: false }, ee = { lowS: e.lowS, prehash: false };
  function ne(A, B, L = F) {
    let { seed: V, k2sig: M } = $(A, B, L), te = e;
    return hi(te.hash.outputLen, te.nByteLength, te.hmac)(V, M);
  }
  f.BASE._setWindowSize(8);
  function be(A, B, L, V = ee) {
    let M = A;
    if (B = $e("msgHash", B), L = $e("publicKey", L), "strict" in V) throw new Error("options.strict was renamed to lowS");
    let { lowS: te, prehash: ce } = V, Ee, Lt;
    try {
      if (typeof M == "string" || M instanceof Uint8Array) try {
        Ee = y.fromDER(M);
      } catch (ft) {
        if (!(ft instanceof pn.Err)) throw ft;
        Ee = y.fromCompact(M);
      }
      else if (typeof M == "object" && typeof M.r == "bigint" && typeof M.s == "bigint") {
        let { r: ft, s: Rn } = M;
        Ee = new y(ft, Rn);
      } else throw new Error("PARSE");
      Lt = f.fromHex(L);
    } catch (ft) {
      if (ft.message === "PARSE") throw new Error("signature must be Signature instance, Uint8Array or hex string");
      return false;
    }
    if (te && Ee.hasHighS()) return false;
    ce && (B = e.hash(B));
    let { r: Ut, s: Nn } = Ee, or = T(B), Dt = c(Nn), qs = o(or * Dt), on = o(Ut * Dt), Tn = f.BASE.multiplyAndAddUnsafe(Lt, qs, on)?.toAffine();
    return Tn ? o(Tn.x) === Ut : false;
  }
  return { CURVE: e, getPublicKey: E, getSharedSecret: S, sign: ne, verify: be, ProjectivePoint: f, Signature: y, utils: I };
}
function zf(n31) {
  return { hash: n31, hmac: (e, ...t) => dn(n31, e, Pa(...t)), randomBytes: Ta };
}
function Go(n31, e) {
  let t = (r) => Fo({ ...n31, ...zf(r) });
  return Object.freeze({ ...t(e), create: t });
}
var Mo = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), _o = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Hf = BigInt(1), Ei = BigInt(2), $o = (n31, e) => (n31 + e / Ei) / e;
function Vf(n31) {
  let e = Mo, t = BigInt(3), r = BigInt(6), s = BigInt(11), i = BigInt(22), a = BigInt(23), o = BigInt(44), c = BigInt(88), f = n31 * n31 * n31 % e, d = f * f * n31 % e, l = Me(d, t, e) * d % e, x = Me(l, t, e) * d % e, p = Me(x, Ei, e) * f % e, b = Me(p, s, e) * p % e, h = Me(b, i, e) * b % e, m = Me(h, o, e) * h % e, y = Me(m, c, e) * m % e, I = Me(y, o, e) * h % e, E = Me(I, t, e) * d % e, C = Me(E, a, e) * b % e, S = Me(C, r, e) * f % e, P = Me(S, Ei, e);
  if (!Ai.eql(Ai.sqr(P), n31)) throw new Error("Cannot find square root");
  return P;
}
var Ai = Oo(Mo, void 0, void 0, { sqrt: Vf }), Bt = Go({ a: BigInt(0), b: BigInt(7), Fp: Ai, n: _o, Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"), Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"), h: BigInt(1), lowS: true, endo: { beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"), splitScalar: (n31) => {
  let e = _o, t = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Hf * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = t, a = BigInt("0x100000000000000000000000000000000"), o = $o(i * n31, e), c = $o(-r * n31, e), f = ke(n31 - o * t - c * s, e), d = ke(-o * r - c * i, e), l = f > a, x = d > a;
  if (l && (f = e - f), x && (d = e - d), f > a || d > a) throw new Error("splitScalar: Endomorphism failed, k=" + n31);
  return { k1neg: l, k1: f, k2neg: x, k2: d };
} } }, wt), eh = BigInt(0);
var th = Bt.ProjectivePoint;
var Ii = "0x0000000000000000000000000000000000000000";
var ds = "0x0000000000000000000000000000000000000000000000000000000000000000";
var ki = `Ethereum Signed Message:
`;
var zo = BigInt(0), Ho = BigInt(1), Bi = BigInt(2), Vo = BigInt(27), Ko = BigInt(28), us = BigInt(35), Wo = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Kf = Wo / Bi, Wf = Symbol.for("nodejs.util.inspect.custom"), bn = {};
function Si(n31) {
  return Pe(Y(n31), 32);
}
var Se = class n5 {
  #e;
  #t;
  #n;
  #r;
  get r() {
    return this.#e;
  }
  set r(e) {
    u(gt(e) === 32, "invalid r", "value", e), this.#e = g(e);
  }
  get s() {
    return u(parseInt(this.#t.substring(0, 3)) < 8, "non-canonical s; use ._s", "s", this.#t), this.#t;
  }
  set s(e) {
    u(gt(e) === 32, "invalid s", "value", e), this.#t = g(e);
  }
  get _s() {
    return this.#t;
  }
  isValid() {
    return BigInt(this.#t) <= Kf;
  }
  get v() {
    return this.#n;
  }
  set v(e) {
    let t = K(e, "value");
    u(t === 27 || t === 28, "invalid v", "v", e), this.#n = t;
  }
  get networkV() {
    return this.#r;
  }
  get legacyChainId() {
    let e = this.networkV;
    return e == null ? null : n5.getChainId(e);
  }
  get yParity() {
    return this.v === 27 ? 0 : 1;
  }
  get yParityAndS() {
    let e = v(this.s);
    return this.yParity && (e[0] |= 128), g(e);
  }
  get compactSerialized() {
    return _([this.r, this.yParityAndS]);
  }
  get serialized() {
    return _([this.r, this.s, this.yParity ? "0x1c" : "0x1b"]);
  }
  constructor(e, t, r, s) {
    Ae(e, bn, "Signature"), this.#e = t, this.#t = r, this.#n = s, this.#r = null;
  }
  getCanonical() {
    if (this.isValid()) return this;
    let e = Wo - BigInt(this._s), t = 55 - this.v, r = new n5(bn, this.r, Si(e), t);
    return this.networkV && (r.#r = this.networkV), r;
  }
  clone() {
    let e = new n5(bn, this.r, this._s, this.v);
    return this.networkV && (e.#r = this.networkV), e;
  }
  toJSON() {
    let e = this.networkV;
    return { _type: "signature", networkV: e != null ? e.toString() : null, r: this.r, s: this._s, v: this.v };
  }
  [Wf]() {
    return this.toString();
  }
  toString() {
    return this.isValid() ? `Signature { r: ${this.r}, s: ${this._s}, v: ${this.v} }` : `Signature { r: ${this.r}, s: ${this._s}, v: ${this.v}, valid: false }`;
  }
  static getChainId(e) {
    let t = D(e, "v");
    return t == Vo || t == Ko ? zo : (u(t >= us, "invalid EIP-155 v", "v", e), (t - us) / Bi);
  }
  static getChainIdV(e, t) {
    return D(e) * Bi + BigInt(35 + t - 27);
  }
  static getNormalizedV(e) {
    let t = D(e);
    return t === zo || t === Vo ? 27 : t === Ho || t === Ko ? 28 : (u(t >= us, "invalid v", "v", e), t & Ho ? 27 : 28);
  }
  static from(e) {
    function t(f, d) {
      u(f, d, "signature", e);
    }
    if (e == null) return new n5(bn, ds, ds, 27);
    if (typeof e == "string") {
      let f = v(e, "signature");
      if (f.length === 64) {
        let d = g(f.slice(0, 32)), l = f.slice(32, 64), x = l[0] & 128 ? 28 : 27;
        return l[0] &= 127, new n5(bn, d, g(l), x);
      }
      if (f.length === 65) {
        let d = g(f.slice(0, 32)), l = g(f.slice(32, 64)), x = n5.getNormalizedV(f[64]);
        return new n5(bn, d, l, x);
      }
      t(false, "invalid raw signature length");
    }
    if (e instanceof n5) return e.clone();
    let r = e.r;
    t(r != null, "missing r");
    let s = Si(r), i = (function(f, d) {
      if (f != null) return Si(f);
      if (d != null) {
        t(fe(d, 32), "invalid yParityAndS");
        let l = v(d);
        return l[0] &= 127, g(l);
      }
      t(false, "missing s");
    })(e.s, e.yParityAndS), { networkV: a, v: o } = (function(f, d, l) {
      if (f != null) {
        let x = D(f);
        return { networkV: x >= us ? x : void 0, v: n5.getNormalizedV(x) };
      }
      if (d != null) return t(fe(d, 32), "invalid yParityAndS"), { v: v(d)[0] & 128 ? 28 : 27 };
      if (l != null) {
        switch (K(l, "sig.yParity")) {
          case 0:
            return { v: 27 };
          case 1:
            return { v: 28 };
        }
        t(false, "invalid yParity");
      }
      t(false, "missing v");
    })(e.v, e.yParityAndS, e.yParity), c = new n5(bn, s, i, o);
    return a && (c.#r = a), t(e.yParity == null || K(e.yParity, "sig.yParity") === c.yParity, "yParity mismatch"), t(e.yParityAndS == null || e.yParityAndS === c.yParityAndS, "yParityAndS mismatch"), c;
  }
};
var Be = class n6 {
  #e;
  constructor(e) {
    u(gt(e) === 32, "invalid private key", "privateKey", "[REDACTED]"), this.#e = g(e);
  }
  get privateKey() {
    return this.#e;
  }
  get publicKey() {
    return n6.computePublicKey(this.#e);
  }
  get compressedPublicKey() {
    return n6.computePublicKey(this.#e, true);
  }
  sign(e) {
    u(gt(e) === 32, "invalid digest length", "digest", e);
    let t = Bt.sign(re(e), re(this.#e), { lowS: true });
    return Se.from({ r: Ne(t.r, 32), s: Ne(t.s, 32), v: t.recovery ? 28 : 27 });
  }
  computeSharedSecret(e) {
    let t = n6.computePublicKey(e);
    return g(Bt.getSharedSecret(re(this.#e), v(t), false));
  }
  static computePublicKey(e, t) {
    let r = v(e, "key");
    if (r.length === 32) {
      let i = Bt.getPublicKey(r, !!t);
      return g(i);
    }
    if (r.length === 64) {
      let i = new Uint8Array(65);
      i[0] = 4, i.set(r, 1), r = i;
    }
    let s = Bt.ProjectivePoint.fromHex(r);
    return g(s.toRawBytes(t));
  }
  static recoverPublicKey(e, t) {
    u(gt(e) === 32, "invalid digest length", "digest", e);
    let r = Se.from(t), s = Bt.Signature.fromCompact(re(_([r.r, r.s])));
    s = s.addRecoveryBit(r.yParity);
    let i = s.recoverPublicKey(re(e));
    return u(i != null, "invalid signature for digest", "signature", t), "0x" + i.toHex(false);
  }
  static addPoints(e, t, r) {
    let s = Bt.ProjectivePoint.fromHex(n6.computePublicKey(e).substring(2)), i = Bt.ProjectivePoint.fromHex(n6.computePublicKey(t).substring(2));
    return "0x" + s.add(i).toHex(!!r);
  }
};
var Jf = BigInt(0), qf = BigInt(36);
function Jo(n31) {
  n31 = n31.toLowerCase();
  let e = n31.substring(2).split(""), t = new Uint8Array(40);
  for (let s = 0; s < 40; s++) t[s] = e[s].charCodeAt(0);
  let r = v(z(t));
  for (let s = 0; s < 40; s += 2) r[s >> 1] >> 4 >= 8 && (e[s] = e[s].toUpperCase()), (r[s >> 1] & 15) >= 8 && (e[s + 1] = e[s + 1].toUpperCase());
  return "0x" + e.join("");
}
var Pi = {};
for (let n31 = 0; n31 < 10; n31++) Pi[String(n31)] = String(n31);
for (let n31 = 0; n31 < 26; n31++) Pi[String.fromCharCode(65 + n31)] = String(10 + n31);
var qo = 15;
function jf(n31) {
  n31 = n31.toUpperCase(), n31 = n31.substring(4) + n31.substring(0, 2) + "00";
  let e = n31.split("").map((r) => Pi[r]).join("");
  for (; e.length >= qo; ) {
    let r = e.substring(0, qo);
    e = parseInt(r, 10) % 97 + e.substring(r.length);
  }
  let t = String(98 - parseInt(e, 10) % 97);
  for (; t.length < 2; ) t = "0" + t;
  return t;
}
var Zf = (function() {
  let n31 = {};
  for (let e = 0; e < 36; e++) {
    let t = "0123456789abcdefghijklmnopqrstuvwxyz"[e];
    n31[t] = BigInt(e);
  }
  return n31;
})();
function Yf(n31) {
  n31 = n31.toLowerCase();
  let e = Jf;
  for (let t = 0; t < n31.length; t++) e = e * qf + Zf[n31[t]];
  return e;
}
function q(n31) {
  if (u(typeof n31 == "string", "invalid address", "address", n31), n31.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
    n31.startsWith("0x") || (n31 = "0x" + n31);
    let e = Jo(n31);
    return u(!n31.match(/([A-F].*[a-f])|([a-f].*[A-F])/) || e === n31, "bad address checksum", "address", n31), e;
  }
  if (n31.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
    u(n31.substring(2, 4) === jf(n31), "bad icap checksum", "address", n31);
    let e = Yf(n31.substring(4)).toString(16);
    for (; e.length < 40; ) e = "0" + e;
    return Jo("0x" + e);
  }
  u(false, "invalid address", "address", n31);
}
function jo(n31) {
  return n31 && typeof n31.getAddress == "function";
}
async function Ni(n31, e) {
  let t = await e;
  return (t == null || t === "0x0000000000000000000000000000000000000000") && (k(typeof n31 != "string", "unconfigured name", "UNCONFIGURED_NAME", { value: n31 }), u(false, "invalid AddressLike value; did not resolve to a value address", "target", n31)), q(t);
}
function Zt(n31, e) {
  if (typeof n31 == "string") return n31.match(/^0x[0-9a-f]{40}$/i) ? q(n31) : (k(e != null, "ENS resolution requires a provider", "UNSUPPORTED_OPERATION", { operation: "resolveName" }), Ni(n31, e.resolveName(n31)));
  if (jo(n31)) return Ni(n31, n31.getAddress());
  if (n31 && typeof n31.then == "function") return Ni(n31, n31);
  u(false, "unsupported addressable value", "target", n31);
}
var st = {};
function N(n31, e) {
  let t = false;
  return e < 0 && (t = true, e *= -1), new se(st, `${t ? "" : "u"}int${e}`, n31, { signed: t, width: e });
}
function J(n31, e) {
  return new se(st, `bytes${e || ""}`, n31, { size: e });
}
var Zo = Symbol.for("_ethers_typed"), se = class n7 {
  type;
  value;
  #e;
  _typedSymbol;
  constructor(e, t, r, s) {
    s == null && (s = null), Ae(st, e, "Typed"), R(this, { _typedSymbol: Zo, type: t, value: r }), this.#e = s, this.format();
  }
  format() {
    if (this.type === "array") throw new Error("");
    if (this.type === "dynamicArray") throw new Error("");
    return this.type === "tuple" ? `tuple(${this.value.map((e) => e.format()).join(",")})` : this.type;
  }
  defaultValue() {
    return 0;
  }
  minValue() {
    return 0;
  }
  maxValue() {
    return 0;
  }
  isBigInt() {
    return !!this.type.match(/^u?int[0-9]+$/);
  }
  isData() {
    return this.type.startsWith("bytes");
  }
  isString() {
    return this.type === "string";
  }
  get tupleName() {
    if (this.type !== "tuple") throw TypeError("not a tuple");
    return this.#e;
  }
  get arrayLength() {
    if (this.type !== "array") throw TypeError("not an array");
    return this.#e === true ? -1 : this.#e === false ? this.value.length : null;
  }
  static from(e, t) {
    return new n7(st, e, t);
  }
  static uint8(e) {
    return N(e, 8);
  }
  static uint16(e) {
    return N(e, 16);
  }
  static uint24(e) {
    return N(e, 24);
  }
  static uint32(e) {
    return N(e, 32);
  }
  static uint40(e) {
    return N(e, 40);
  }
  static uint48(e) {
    return N(e, 48);
  }
  static uint56(e) {
    return N(e, 56);
  }
  static uint64(e) {
    return N(e, 64);
  }
  static uint72(e) {
    return N(e, 72);
  }
  static uint80(e) {
    return N(e, 80);
  }
  static uint88(e) {
    return N(e, 88);
  }
  static uint96(e) {
    return N(e, 96);
  }
  static uint104(e) {
    return N(e, 104);
  }
  static uint112(e) {
    return N(e, 112);
  }
  static uint120(e) {
    return N(e, 120);
  }
  static uint128(e) {
    return N(e, 128);
  }
  static uint136(e) {
    return N(e, 136);
  }
  static uint144(e) {
    return N(e, 144);
  }
  static uint152(e) {
    return N(e, 152);
  }
  static uint160(e) {
    return N(e, 160);
  }
  static uint168(e) {
    return N(e, 168);
  }
  static uint176(e) {
    return N(e, 176);
  }
  static uint184(e) {
    return N(e, 184);
  }
  static uint192(e) {
    return N(e, 192);
  }
  static uint200(e) {
    return N(e, 200);
  }
  static uint208(e) {
    return N(e, 208);
  }
  static uint216(e) {
    return N(e, 216);
  }
  static uint224(e) {
    return N(e, 224);
  }
  static uint232(e) {
    return N(e, 232);
  }
  static uint240(e) {
    return N(e, 240);
  }
  static uint248(e) {
    return N(e, 248);
  }
  static uint256(e) {
    return N(e, 256);
  }
  static uint(e) {
    return N(e, 256);
  }
  static int8(e) {
    return N(e, -8);
  }
  static int16(e) {
    return N(e, -16);
  }
  static int24(e) {
    return N(e, -24);
  }
  static int32(e) {
    return N(e, -32);
  }
  static int40(e) {
    return N(e, -40);
  }
  static int48(e) {
    return N(e, -48);
  }
  static int56(e) {
    return N(e, -56);
  }
  static int64(e) {
    return N(e, -64);
  }
  static int72(e) {
    return N(e, -72);
  }
  static int80(e) {
    return N(e, -80);
  }
  static int88(e) {
    return N(e, -88);
  }
  static int96(e) {
    return N(e, -96);
  }
  static int104(e) {
    return N(e, -104);
  }
  static int112(e) {
    return N(e, -112);
  }
  static int120(e) {
    return N(e, -120);
  }
  static int128(e) {
    return N(e, -128);
  }
  static int136(e) {
    return N(e, -136);
  }
  static int144(e) {
    return N(e, -144);
  }
  static int152(e) {
    return N(e, -152);
  }
  static int160(e) {
    return N(e, -160);
  }
  static int168(e) {
    return N(e, -168);
  }
  static int176(e) {
    return N(e, -176);
  }
  static int184(e) {
    return N(e, -184);
  }
  static int192(e) {
    return N(e, -192);
  }
  static int200(e) {
    return N(e, -200);
  }
  static int208(e) {
    return N(e, -208);
  }
  static int216(e) {
    return N(e, -216);
  }
  static int224(e) {
    return N(e, -224);
  }
  static int232(e) {
    return N(e, -232);
  }
  static int240(e) {
    return N(e, -240);
  }
  static int248(e) {
    return N(e, -248);
  }
  static int256(e) {
    return N(e, -256);
  }
  static int(e) {
    return N(e, -256);
  }
  static bytes1(e) {
    return J(e, 1);
  }
  static bytes2(e) {
    return J(e, 2);
  }
  static bytes3(e) {
    return J(e, 3);
  }
  static bytes4(e) {
    return J(e, 4);
  }
  static bytes5(e) {
    return J(e, 5);
  }
  static bytes6(e) {
    return J(e, 6);
  }
  static bytes7(e) {
    return J(e, 7);
  }
  static bytes8(e) {
    return J(e, 8);
  }
  static bytes9(e) {
    return J(e, 9);
  }
  static bytes10(e) {
    return J(e, 10);
  }
  static bytes11(e) {
    return J(e, 11);
  }
  static bytes12(e) {
    return J(e, 12);
  }
  static bytes13(e) {
    return J(e, 13);
  }
  static bytes14(e) {
    return J(e, 14);
  }
  static bytes15(e) {
    return J(e, 15);
  }
  static bytes16(e) {
    return J(e, 16);
  }
  static bytes17(e) {
    return J(e, 17);
  }
  static bytes18(e) {
    return J(e, 18);
  }
  static bytes19(e) {
    return J(e, 19);
  }
  static bytes20(e) {
    return J(e, 20);
  }
  static bytes21(e) {
    return J(e, 21);
  }
  static bytes22(e) {
    return J(e, 22);
  }
  static bytes23(e) {
    return J(e, 23);
  }
  static bytes24(e) {
    return J(e, 24);
  }
  static bytes25(e) {
    return J(e, 25);
  }
  static bytes26(e) {
    return J(e, 26);
  }
  static bytes27(e) {
    return J(e, 27);
  }
  static bytes28(e) {
    return J(e, 28);
  }
  static bytes29(e) {
    return J(e, 29);
  }
  static bytes30(e) {
    return J(e, 30);
  }
  static bytes31(e) {
    return J(e, 31);
  }
  static bytes32(e) {
    return J(e, 32);
  }
  static address(e) {
    return new n7(st, "address", e);
  }
  static bool(e) {
    return new n7(st, "bool", !!e);
  }
  static bytes(e) {
    return new n7(st, "bytes", e);
  }
  static string(e) {
    return new n7(st, "string", e);
  }
  static array(e, t) {
    throw new Error("not implemented yet");
  }
  static tuple(e, t) {
    throw new Error("not implemented yet");
  }
  static overrides(e) {
    return new n7(st, "overrides", Object.assign({}, e));
  }
  static isTyped(e) {
    return e && typeof e == "object" && "_typedSymbol" in e && e._typedSymbol === Zo;
  }
  static dereference(e, t) {
    if (n7.isTyped(e)) {
      if (e.type !== t) throw new Error(`invalid type: expecetd ${t}, got ${e.type}`);
      return e.value;
    }
    return e;
  }
};
var xs = class extends de {
  constructor(e) {
    super("address", "address", e, false);
  }
  defaultValue() {
    return "0x0000000000000000000000000000000000000000";
  }
  encode(e, t) {
    let r = se.dereference(t, "string");
    try {
      r = q(r);
    } catch (s) {
      return this._throwError(s.message, t);
    }
    return e.writeValue(r);
  }
  decode(e) {
    return q(Ne(e.readValue(), 20));
  }
};
var hs = class extends de {
  coder;
  constructor(e) {
    super(e.name, e.type, "_", e.dynamic), this.coder = e;
  }
  defaultValue() {
    return this.coder.defaultValue();
  }
  encode(e, t) {
    return this.coder.encode(e, t);
  }
  decode(e) {
    return this.coder.decode(e);
  }
};
function Ti(n31, e, t) {
  let r = [];
  if (Array.isArray(t)) r = t;
  else if (t && typeof t == "object") {
    let c = {};
    r = e.map((f) => {
      let d = f.localName;
      return k(d, "cannot encode object for signature with missing names", "INVALID_ARGUMENT", { argument: "values", info: { coder: f }, value: t }), k(!c[d], "cannot encode object for signature with duplicate names", "INVALID_ARGUMENT", { argument: "values", info: { coder: f }, value: t }), c[d] = true, t[d];
    });
  } else u(false, "invalid tuple value", "tuple", t);
  u(e.length === r.length, "types/value length mismatch", "tuple", t);
  let s = new ln(), i = new ln(), a = [];
  e.forEach((c, f) => {
    let d = r[f];
    if (c.dynamic) {
      let l = i.length;
      c.encode(i, d);
      let x = s.writeUpdatableValue();
      a.push((p) => {
        x(p + l);
      });
    } else c.encode(s, d);
  }), a.forEach((c) => {
    c(s.length);
  });
  let o = n31.appendWriter(s);
  return o += n31.appendWriter(i), o;
}
function Ri(n31, e) {
  let t = [], r = [], s = n31.subReader(0);
  return e.forEach((i) => {
    let a = null;
    if (i.dynamic) {
      let o = n31.readIndex(), c = s.subReader(o);
      try {
        a = i.decode(c);
      } catch (f) {
        if (Cn(f, "BUFFER_OVERRUN")) throw f;
        a = f, a.baseType = i.name, a.name = i.localName, a.type = i.type;
      }
    } else try {
      a = i.decode(n31);
    } catch (o) {
      if (Cn(o, "BUFFER_OVERRUN")) throw o;
      a = o, a.baseType = i.name, a.name = i.localName, a.type = i.type;
    }
    if (a == null) throw new Error("investigate");
    t.push(a), r.push(i.localName || null);
  }), dt.fromItems(t, r);
}
var ps = class extends de {
  coder;
  length;
  constructor(e, t, r) {
    let s = e.type + "[" + (t >= 0 ? t : "") + "]", i = t === -1 || e.dynamic;
    super("array", s, r, i), R(this, { coder: e, length: t });
  }
  defaultValue() {
    let e = this.coder.defaultValue(), t = [];
    for (let r = 0; r < this.length; r++) t.push(e);
    return t;
  }
  encode(e, t) {
    let r = se.dereference(t, "array");
    Array.isArray(r) || this._throwError("expected array value", r);
    let s = this.length;
    s === -1 && (s = r.length, e.writeValue(r.length)), Un(r.length, s, "coder array" + (this.localName ? " " + this.localName : ""));
    let i = [];
    for (let a = 0; a < r.length; a++) i.push(this.coder);
    return Ti(e, i, r);
  }
  decode(e) {
    let t = this.length;
    t === -1 && (t = e.readIndex(), k(t * we <= e.dataLength, "insufficient data length", "BUFFER_OVERRUN", { buffer: e.bytes, offset: t * we, length: e.dataLength }));
    let r = [];
    for (let s = 0; s < t; s++) r.push(new hs(this.coder));
    return Ri(e, r);
  }
};
var bs = class extends de {
  constructor(e) {
    super("bool", "bool", e, false);
  }
  defaultValue() {
    return false;
  }
  encode(e, t) {
    let r = se.dereference(t, "bool");
    return e.writeValue(r ? 1 : 0);
  }
  decode(e) {
    return !!e.readValue();
  }
};
var gr = class extends de {
  constructor(e, t) {
    super(e, e, t, true);
  }
  defaultValue() {
    return "0x";
  }
  encode(e, t) {
    t = re(t);
    let r = e.writeValue(t.length);
    return r += e.writeBytes(t), r;
  }
  decode(e) {
    return e.readBytes(e.readIndex(), true);
  }
}, ms = class extends gr {
  constructor(e) {
    super("bytes", e);
  }
  decode(e) {
    return g(super.decode(e));
  }
};
var gs = class extends de {
  size;
  constructor(e, t) {
    let r = "bytes" + String(e);
    super(r, r, t, false), R(this, { size: e }, { size: "number" });
  }
  defaultValue() {
    return "0x0000000000000000000000000000000000000000000000000000000000000000".substring(0, 2 + this.size * 2);
  }
  encode(e, t) {
    let r = re(se.dereference(t, this.type));
    return r.length !== this.size && this._throwError("incorrect data length", t), e.writeBytes(r);
  }
  decode(e) {
    return g(e.readBytes(this.size));
  }
};
var Xf = new Uint8Array([]), ys = class extends de {
  constructor(e) {
    super("null", "", e, false);
  }
  defaultValue() {
    return null;
  }
  encode(e, t) {
    return t != null && this._throwError("not null", t), e.writeBytes(Xf);
  }
  decode(e) {
    return e.readBytes(0), null;
  }
};
var Qf = BigInt(0), el = BigInt(1), tl = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), ws = class extends de {
  size;
  signed;
  constructor(e, t, r) {
    let s = (t ? "int" : "uint") + e * 8;
    super(s, s, r, false), R(this, { size: e, signed: t }, { size: "number", signed: "boolean" });
  }
  defaultValue() {
    return 0;
  }
  encode(e, t) {
    let r = D(se.dereference(t, this.type)), s = We(tl, we * 8);
    if (this.signed) {
      let i = We(s, this.size * 8 - 1);
      (r > i || r < -(i + el)) && this._throwError("value out-of-bounds", t), r = Gn(r, 8 * we);
    } else (r < Qf || r > We(s, this.size * 8)) && this._throwError("value out-of-bounds", t);
    return e.writeValue(r);
  }
  decode(e) {
    let t = We(e.readValue(), this.size * 8);
    return this.signed && (t = Gt(t, this.size * 8)), t;
  }
};
var vs = class extends gr {
  constructor(e) {
    super("string", e);
  }
  defaultValue() {
    return "";
  }
  encode(e, t) {
    return super.encode(e, me(se.dereference(t, "string")));
  }
  decode(e) {
    return Kr(super.decode(e));
  }
};
var mn = class extends de {
  coders;
  constructor(e, t) {
    let r = false, s = [];
    e.forEach((a) => {
      a.dynamic && (r = true), s.push(a.type);
    });
    let i = "tuple(" + s.join(",") + ")";
    super("tuple", i, t, r), R(this, { coders: Object.freeze(e.slice()) });
  }
  defaultValue() {
    let e = [];
    this.coders.forEach((r) => {
      e.push(r.defaultValue());
    });
    let t = this.coders.reduce((r, s) => {
      let i = s.localName;
      return i && (r[i] || (r[i] = 0), r[i]++), r;
    }, {});
    return this.coders.forEach((r, s) => {
      let i = r.localName;
      !i || t[i] !== 1 || (i === "length" && (i = "_length"), e[i] == null && (e[i] = e[s]));
    }), Object.freeze(e);
  }
  encode(e, t) {
    let r = se.dereference(t, "tuple");
    return Ti(e, this.coders, r);
  }
  decode(e) {
    return Ri(e, this.coders);
  }
};
function Oi(n31, e) {
  return { address: q(n31), storageKeys: e.map((t, r) => (u(fe(t, 32), "invalid slot", `storageKeys[${r}]`, t), t.toLowerCase())) };
}
function Yt(n31) {
  if (Array.isArray(n31)) return n31.map((t, r) => Array.isArray(t) ? (u(t.length === 2, "invalid slot set", `value[${r}]`, t), Oi(t[0], t[1])) : (u(t != null && typeof t == "object", "invalid address-slot set", "value", n31), Oi(t.address, t.storageKeys)));
  u(n31 != null && typeof n31 == "object", "invalid access list", "value", n31);
  let e = Object.keys(n31).map((t) => {
    let r = n31[t].reduce((s, i) => (s[i] = true, s), {});
    return Oi(t, Object.keys(r).sort());
  });
  return e.sort((t, r) => t.address.localeCompare(r.address)), e;
}
function Ci(n31) {
  return { address: q(n31.address), nonce: D(n31.nonce != null ? n31.nonce : 0), chainId: D(n31.chainId != null ? n31.chainId : 0), signature: Se.from(n31.signature) };
}
function ut(n31) {
  let e;
  return typeof n31 == "string" ? e = Be.computePublicKey(n31, false) : e = n31.publicKey, q(z("0x" + e.substring(4)).substring(26));
}
function Es(n31, e) {
  return ut(Be.recoverPublicKey(n31, e));
}
var ge = BigInt(0), nl = BigInt(2), rl = BigInt(27), sl = BigInt(28), il = BigInt(35), al = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), ol = Symbol.for("nodejs.util.inspect.custom"), Li = 4096 * 32, As = 128;
function cl(n31) {
  return { blobToKzgCommitment: (r) => {
    if ("computeBlobProof" in n31) {
      if ("blobToKzgCommitment" in n31 && typeof n31.blobToKzgCommitment == "function") return v(n31.blobToKzgCommitment(g(r)));
    } else if ("blobToKzgCommitment" in n31 && typeof n31.blobToKzgCommitment == "function") return v(n31.blobToKzgCommitment(r));
    if ("blobToKZGCommitment" in n31 && typeof n31.blobToKZGCommitment == "function") return v(n31.blobToKZGCommitment(g(r)));
    u(false, "unsupported KZG library", "kzg", n31);
  }, computeBlobKzgProof: (r, s) => {
    if ("computeBlobProof" in n31 && typeof n31.computeBlobProof == "function") return v(n31.computeBlobProof(g(r), g(s)));
    if ("computeBlobKzgProof" in n31 && typeof n31.computeBlobKzgProof == "function") return n31.computeBlobKzgProof(r, s);
    if ("computeBlobKZGProof" in n31 && typeof n31.computeBlobKZGProof == "function") return v(n31.computeBlobKZGProof(g(r), g(s)));
    u(false, "unsupported KZG library", "kzg", n31);
  } };
}
function Yo(n31, e) {
  let t = n31.toString(16);
  for (; t.length < 2; ) t = "0" + t;
  return t += ue(e).substring(4), "0x" + t;
}
function qn(n31) {
  return n31 === "0x" ? null : q(n31);
}
function Is(n31, e) {
  try {
    return Yt(n31);
  } catch (t) {
    u(false, t.message, e, n31);
  }
}
function fl(n31, e) {
  try {
    if (!Array.isArray(n31)) throw new Error("authorizationList: invalid array");
    let t = [];
    for (let r = 0; r < n31.length; r++) {
      let s = n31[r];
      if (!Array.isArray(s)) throw new Error(`authorization[${r}]: invalid array`);
      if (s.length !== 6) throw new Error(`authorization[${r}]: wrong length`);
      if (!s[1]) throw new Error(`authorization[${r}]: null address`);
      t.push({ address: qn(s[1]), nonce: X(s[2], "nonce"), chainId: X(s[0], "chainId"), signature: Se.from({ yParity: gn(s[3], "yParity"), r: Pe(s[4], 32), s: Pe(s[5], 32) }) });
    }
    return t;
  } catch (t) {
    u(false, t.message, e, n31);
  }
}
function gn(n31, e) {
  return n31 === "0x" ? 0 : K(n31, e);
}
function X(n31, e) {
  if (n31 === "0x") return ge;
  let t = D(n31, e);
  return u(t <= al, "value exceeds uint size", e, t), t;
}
function H(n31, e) {
  let t = D(n31, "value"), r = Y(t);
  return u(r.length <= 32, "value too large", `tx.${e}`, t), r;
}
function ks(n31) {
  return Yt(n31).map((e) => [e.address, e.storageKeys]);
}
function ll(n31) {
  return n31.map((e) => [H(e.chainId, "chainId"), e.address, H(e.nonce, "nonce"), H(e.signature.yParity, "yParity"), Y(e.signature.r), Y(e.signature._s)]);
}
function dl(n31, e) {
  u(Array.isArray(n31), `invalid ${e}`, "value", n31);
  for (let t = 0; t < n31.length; t++) u(fe(n31[t], 32), "invalid ${ param } hash", `value[${t}]`, n31[t]);
  return n31;
}
function ul(n31) {
  let e = _t(n31);
  u(Array.isArray(e) && (e.length === 9 || e.length === 6), "invalid field count for legacy transaction", "data", n31);
  let t = { type: 0, nonce: gn(e[0], "nonce"), gasPrice: X(e[1], "gasPrice"), gasLimit: X(e[2], "gasLimit"), to: qn(e[3]), value: X(e[4], "value"), data: g(e[5]), chainId: ge };
  if (e.length === 6) return t;
  let r = X(e[6], "v"), s = X(e[7], "r"), i = X(e[8], "s");
  if (s === ge && i === ge) t.chainId = r;
  else {
    let a = (r - il) / nl;
    a < ge && (a = ge), t.chainId = a, u(a !== ge || r === rl || r === sl, "non-canonical legacy v", "v", e[6]), t.signature = Se.from({ r: Pe(e[7], 32), s: Pe(e[8], 32), v: r });
  }
  return t;
}
function xl(n31, e) {
  let t = [H(n31.nonce, "nonce"), H(n31.gasPrice || 0, "gasPrice"), H(n31.gasLimit, "gasLimit"), n31.to || "0x", H(n31.value, "value"), n31.data], r = ge;
  if (n31.chainId != ge) r = D(n31.chainId, "tx.chainId"), u(!e || e.networkV == null || e.legacyChainId === r, "tx.chainId/sig.v mismatch", "sig", e);
  else if (n31.signature) {
    let i = n31.signature.legacyChainId;
    i != null && (r = i);
  }
  if (!e) return r !== ge && (t.push(Y(r)), t.push("0x"), t.push("0x")), Fe(t);
  let s = BigInt(27 + e.yParity);
  return r !== ge ? s = Se.getChainIdV(r, e.v) : BigInt(e.v) !== s && u(false, "tx.chainId/sig.v mismatch", "sig", e), t.push(Y(s)), t.push(Y(e.r)), t.push(Y(e._s)), Fe(t);
}
function Ss(n31, e) {
  let t;
  try {
    if (t = gn(e[0], "yParity"), t !== 0 && t !== 1) throw new Error("bad yParity");
  } catch {
    u(false, "invalid yParity", "yParity", e[0]);
  }
  let r = Pe(e[1], 32), s = Pe(e[2], 32), i = Se.from({ r, s, yParity: t });
  n31.signature = i;
}
function hl(n31) {
  let e = _t(v(n31).slice(1));
  u(Array.isArray(e) && (e.length === 9 || e.length === 12), "invalid field count for transaction type: 2", "data", g(n31));
  let t = { type: 2, chainId: X(e[0], "chainId"), nonce: gn(e[1], "nonce"), maxPriorityFeePerGas: X(e[2], "maxPriorityFeePerGas"), maxFeePerGas: X(e[3], "maxFeePerGas"), gasPrice: null, gasLimit: X(e[4], "gasLimit"), to: qn(e[5]), value: X(e[6], "value"), data: g(e[7]), accessList: Is(e[8], "accessList") };
  return e.length === 9 || Ss(t, e.slice(9)), t;
}
function pl(n31, e) {
  let t = [H(n31.chainId, "chainId"), H(n31.nonce, "nonce"), H(n31.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"), H(n31.maxFeePerGas || 0, "maxFeePerGas"), H(n31.gasLimit, "gasLimit"), n31.to || "0x", H(n31.value, "value"), n31.data, ks(n31.accessList || [])];
  return e && (t.push(H(e.yParity, "yParity")), t.push(Y(e.r)), t.push(Y(e.s))), _(["0x02", Fe(t)]);
}
function bl(n31) {
  let e = _t(v(n31).slice(1));
  u(Array.isArray(e) && (e.length === 8 || e.length === 11), "invalid field count for transaction type: 1", "data", g(n31));
  let t = { type: 1, chainId: X(e[0], "chainId"), nonce: gn(e[1], "nonce"), gasPrice: X(e[2], "gasPrice"), gasLimit: X(e[3], "gasLimit"), to: qn(e[4]), value: X(e[5], "value"), data: g(e[6]), accessList: Is(e[7], "accessList") };
  return e.length === 8 || Ss(t, e.slice(8)), t;
}
function ml(n31, e) {
  let t = [H(n31.chainId, "chainId"), H(n31.nonce, "nonce"), H(n31.gasPrice || 0, "gasPrice"), H(n31.gasLimit, "gasLimit"), n31.to || "0x", H(n31.value, "value"), n31.data, ks(n31.accessList || [])];
  return e && (t.push(H(e.yParity, "recoveryParam")), t.push(Y(e.r)), t.push(Y(e.s))), _(["0x01", Fe(t)]);
}
function gl(n31) {
  let e = _t(v(n31).slice(1)), t = "3", r = null, s = null;
  if (e.length === 4 && Array.isArray(e[0])) {
    t = "3 (network format)";
    let a = e[1], o = e[2], c = e[3];
    u(Array.isArray(a), "invalid network format: blobs not an array", "fields[1]", a), u(Array.isArray(o), "invalid network format: commitments not an array", "fields[2]", o), u(Array.isArray(c), "invalid network format: proofs not an array", "fields[3]", c), u(a.length === o.length, "invalid network format: blobs/commitments length mismatch", "fields", e), u(a.length === c.length, "invalid network format: blobs/proofs length mismatch", "fields", e), s = [];
    for (let f = 0; f < e[1].length; f++) s.push({ data: a[f], commitment: o[f], proof: c[f] });
    e = e[0];
  } else if (e.length === 5 && Array.isArray(e[0])) {
    t = "3 (EIP-7594 network format)", r = K(e[1]);
    let a = e[2], o = e[3], c = e[4];
    u(r === 1, `unsupported EIP-7594 network format version: ${r}`, "fields[1]", r), u(Array.isArray(a), "invalid EIP-7594 network format: blobs not an array", "fields[2]", a), u(Array.isArray(o), "invalid EIP-7594 network format: commitments not an array", "fields[3]", o), u(Array.isArray(c), "invalid EIP-7594 network format: proofs not an array", "fields[4]", c), u(a.length === o.length, "invalid network format: blobs/commitments length mismatch", "fields", e), u(a.length * As === c.length, "invalid network format: blobs/proofs length mismatch", "fields", e), s = [];
    for (let f = 0; f < a.length; f++) {
      let d = [];
      for (let l = 0; l < As; l++) d.push(c[f * As + l]);
      s.push({ data: a[f], commitment: o[f], proof: _(d) });
    }
    e = e[0];
  }
  u(Array.isArray(e) && (e.length === 11 || e.length === 14), `invalid field count for transaction type: ${t}`, "data", g(n31));
  let i = { type: 3, chainId: X(e[0], "chainId"), nonce: gn(e[1], "nonce"), maxPriorityFeePerGas: X(e[2], "maxPriorityFeePerGas"), maxFeePerGas: X(e[3], "maxFeePerGas"), gasPrice: null, gasLimit: X(e[4], "gasLimit"), to: qn(e[5]), value: X(e[6], "value"), data: g(e[7]), accessList: Is(e[8], "accessList"), maxFeePerBlobGas: X(e[9], "maxFeePerBlobGas"), blobVersionedHashes: e[10], blobWrapperVersion: r };
  s && (i.blobs = s), u(i.to != null, `invalid address for transaction type: ${t}`, "data", n31), u(Array.isArray(i.blobVersionedHashes), "invalid blobVersionedHashes: must be an array", "data", n31);
  for (let a = 0; a < i.blobVersionedHashes.length; a++) u(fe(i.blobVersionedHashes[a], 32), `invalid blobVersionedHash at index ${a}: must be length 32`, "data", n31);
  return e.length === 11 || Ss(i, e.slice(11)), i;
}
function yl(n31, e, t) {
  let r = [H(n31.chainId, "chainId"), H(n31.nonce, "nonce"), H(n31.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"), H(n31.maxFeePerGas || 0, "maxFeePerGas"), H(n31.gasLimit, "gasLimit"), n31.to || Ii, H(n31.value, "value"), n31.data, ks(n31.accessList || []), H(n31.maxFeePerBlobGas || 0, "maxFeePerBlobGas"), dl(n31.blobVersionedHashes || [], "blobVersionedHashes")];
  if (e && (r.push(H(e.yParity, "yParity")), r.push(Y(e.r)), r.push(Y(e.s)), t)) {
    if (n31.blobWrapperVersion != null) {
      let s = Y(n31.blobWrapperVersion), i = [];
      for (let { proof: a } of t) {
        let o = v(a), c = o.length / As;
        for (let f = 0; f < o.length; f += c) i.push(o.subarray(f, f + c));
      }
      return _(["0x03", Fe([r, s, t.map((a) => a.data), t.map((a) => a.commitment), i])]);
    }
    return _(["0x03", Fe([r, t.map((s) => s.data), t.map((s) => s.commitment), t.map((s) => s.proof)])]);
  }
  return _(["0x03", Fe(r)]);
}
function wl(n31) {
  let e = _t(v(n31).slice(1));
  u(Array.isArray(e) && (e.length === 10 || e.length === 13), "invalid field count for transaction type: 4", "data", g(n31));
  let t = { type: 4, chainId: X(e[0], "chainId"), nonce: gn(e[1], "nonce"), maxPriorityFeePerGas: X(e[2], "maxPriorityFeePerGas"), maxFeePerGas: X(e[3], "maxFeePerGas"), gasPrice: null, gasLimit: X(e[4], "gasLimit"), to: qn(e[5]), value: X(e[6], "value"), data: g(e[7]), accessList: Is(e[8], "accessList"), authorizationList: fl(e[9], "authorizationList") };
  return e.length === 10 || Ss(t, e.slice(10)), t;
}
function vl(n31, e) {
  let t = [H(n31.chainId, "chainId"), H(n31.nonce, "nonce"), H(n31.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"), H(n31.maxFeePerGas || 0, "maxFeePerGas"), H(n31.gasLimit, "gasLimit"), n31.to || "0x", H(n31.value, "value"), n31.data, ks(n31.accessList || []), ll(n31.authorizationList || [])];
  return e && (t.push(H(e.yParity, "yParity")), t.push(Y(e.r)), t.push(Y(e.s))), _(["0x04", Fe(t)]);
}
var xt = class n8 {
  #e;
  #t;
  #n;
  #r;
  #s;
  #i;
  #a;
  #c;
  #f;
  #x;
  #h;
  #p;
  #u;
  #l;
  #o;
  #d;
  #b;
  #m;
  get type() {
    return this.#e;
  }
  set type(e) {
    switch (e) {
      case null:
        this.#e = null;
        break;
      case 0:
      case "legacy":
        this.#e = 0;
        break;
      case 1:
      case "berlin":
      case "eip-2930":
        this.#e = 1;
        break;
      case 2:
      case "london":
      case "eip-1559":
        this.#e = 2;
        break;
      case 3:
      case "cancun":
      case "eip-4844":
        this.#e = 3;
        break;
      case 4:
      case "pectra":
      case "eip-7702":
        this.#e = 4;
        break;
      default:
        u(false, "unsupported transaction type", "type", e);
    }
  }
  get typeName() {
    switch (this.type) {
      case 0:
        return "legacy";
      case 1:
        return "eip-2930";
      case 2:
        return "eip-1559";
      case 3:
        return "eip-4844";
      case 4:
        return "eip-7702";
    }
    return null;
  }
  get to() {
    let e = this.#t;
    return e == null && this.type === 3 ? Ii : e;
  }
  set to(e) {
    this.#t = e == null ? null : q(e);
  }
  get nonce() {
    return this.#r;
  }
  set nonce(e) {
    this.#r = K(e, "value");
  }
  get gasLimit() {
    return this.#s;
  }
  set gasLimit(e) {
    this.#s = D(e);
  }
  get gasPrice() {
    let e = this.#i;
    return e == null && (this.type === 0 || this.type === 1) ? ge : e;
  }
  set gasPrice(e) {
    this.#i = e == null ? null : D(e, "gasPrice");
  }
  get maxPriorityFeePerGas() {
    let e = this.#a;
    return e ?? (this.type === 2 || this.type === 3 ? ge : null);
  }
  set maxPriorityFeePerGas(e) {
    this.#a = e == null ? null : D(e, "maxPriorityFeePerGas");
  }
  get maxFeePerGas() {
    let e = this.#c;
    return e ?? (this.type === 2 || this.type === 3 ? ge : null);
  }
  set maxFeePerGas(e) {
    this.#c = e == null ? null : D(e, "maxFeePerGas");
  }
  get data() {
    return this.#n;
  }
  set data(e) {
    this.#n = g(e);
  }
  get value() {
    return this.#f;
  }
  set value(e) {
    this.#f = D(e, "value");
  }
  get chainId() {
    return this.#x;
  }
  set chainId(e) {
    this.#x = D(e);
  }
  get signature() {
    return this.#h || null;
  }
  set signature(e) {
    this.#h = e == null ? null : Se.from(e);
  }
  isValid() {
    let e = this.signature;
    if (e && !e.isValid()) return false;
    let t = this.authorizationList;
    if (t) {
      for (let r of t) if (!r.signature.isValid()) return false;
    }
    return true;
  }
  get accessList() {
    let e = this.#p || null;
    return e ?? (this.type === 1 || this.type === 2 || this.type === 3 ? [] : null);
  }
  set accessList(e) {
    this.#p = e == null ? null : Yt(e);
  }
  get authorizationList() {
    let e = this.#b || null;
    return e == null && this.type === 4 ? [] : e;
  }
  set authorizationList(e) {
    this.#b = e == null ? null : e.map((t) => Ci(t));
  }
  get maxFeePerBlobGas() {
    let e = this.#u;
    return e == null && this.type === 3 ? ge : e;
  }
  set maxFeePerBlobGas(e) {
    this.#u = e == null ? null : D(e, "maxFeePerBlobGas");
  }
  get blobVersionedHashes() {
    let e = this.#l;
    return e == null && this.type === 3 ? [] : e;
  }
  set blobVersionedHashes(e) {
    if (e != null) {
      u(Array.isArray(e), "blobVersionedHashes must be an Array", "value", e), e = e.slice();
      for (let t = 0; t < e.length; t++) u(fe(e[t], 32), "invalid blobVersionedHash", `value[${t}]`, e[t]);
    }
    this.#l = e;
  }
  get blobs() {
    return this.#d == null ? null : this.#d.map((e) => Object.assign({}, e));
  }
  set blobs(e) {
    if (e == null) {
      this.#d = null;
      return;
    }
    let t = [], r = [];
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      if (lt(i)) {
        k(this.#o, "adding a raw blob requires a KZG library", "UNSUPPORTED_OPERATION", { operation: "set blobs()" });
        let a = v(i);
        if (u(a.length <= Li, "blob is too large", `blobs[${s}]`, i), a.length !== Li) {
          let f = new Uint8Array(Li);
          f.set(a), a = f;
        }
        let o = this.#o.blobToKzgCommitment(a), c = g(this.#o.computeBlobKzgProof(a, o));
        t.push({ data: g(a), commitment: g(o), proof: c }), r.push(Yo(1, o));
      } else {
        let a = g(i.data), o = g(i.commitment), c = g(i.proof);
        t.push({ data: a, commitment: o, proof: c }), r.push(Yo(1, o));
      }
    }
    this.#d = t, this.#l = r;
  }
  get kzg() {
    return this.#o;
  }
  set kzg(e) {
    e == null ? this.#o = null : this.#o = cl(e);
  }
  get blobWrapperVersion() {
    return this.#m;
  }
  set blobWrapperVersion(e) {
    this.#m = e;
  }
  constructor() {
    this.#e = null, this.#t = null, this.#r = 0, this.#s = ge, this.#i = null, this.#a = null, this.#c = null, this.#n = "0x", this.#f = ge, this.#x = ge, this.#h = null, this.#p = null, this.#u = null, this.#l = null, this.#o = null, this.#d = null, this.#b = null, this.#m = null;
  }
  get hash() {
    return this.signature == null ? null : z(this.#g(true, false));
  }
  get unsignedHash() {
    return z(this.unsignedSerialized);
  }
  get from() {
    return this.signature == null ? null : Es(this.unsignedHash, this.signature.getCanonical());
  }
  get fromPublicKey() {
    return this.signature == null ? null : Be.recoverPublicKey(this.unsignedHash, this.signature.getCanonical());
  }
  isSigned() {
    return this.signature != null;
  }
  #g(e, t) {
    k(!e || this.signature != null, "cannot serialize unsigned transaction; maybe you meant .unsignedSerialized", "UNSUPPORTED_OPERATION", { operation: ".serialized" });
    let r = e ? this.signature : null;
    switch (this.inferType()) {
      case 0:
        return xl(this, r);
      case 1:
        return ml(this, r);
      case 2:
        return pl(this, r);
      case 3:
        return yl(this, r, t ? this.blobs : null);
      case 4:
        return vl(this, r);
    }
    k(false, "unsupported transaction type", "UNSUPPORTED_OPERATION", { operation: ".serialized" });
  }
  get serialized() {
    return this.#g(true, true);
  }
  get unsignedSerialized() {
    return this.#g(false, false);
  }
  inferType() {
    let e = this.inferTypes();
    return e.indexOf(2) >= 0 ? 2 : e.pop();
  }
  inferTypes() {
    let e = this.gasPrice != null, t = this.maxFeePerGas != null || this.maxPriorityFeePerGas != null, r = this.accessList != null, s = this.#u != null || this.#l;
    this.maxFeePerGas != null && this.maxPriorityFeePerGas != null && k(this.maxFeePerGas >= this.maxPriorityFeePerGas, "priorityFee cannot be more than maxFee", "BAD_DATA", { value: this }), k(!t || this.type !== 0 && this.type !== 1, "transaction type cannot have maxFeePerGas or maxPriorityFeePerGas", "BAD_DATA", { value: this }), k(this.type !== 0 || !r, "legacy transaction cannot have accessList", "BAD_DATA", { value: this });
    let i = [];
    return this.type != null ? i.push(this.type) : this.authorizationList && this.authorizationList.length ? i.push(4) : t ? i.push(2) : e ? (i.push(1), r || i.push(0)) : r ? (i.push(1), i.push(2)) : (s && this.to || (i.push(0), i.push(1), i.push(2)), i.push(3)), i.sort(), i;
  }
  isLegacy() {
    return this.type === 0;
  }
  isBerlin() {
    return this.type === 1;
  }
  isLondon() {
    return this.type === 2;
  }
  isCancun() {
    return this.type === 3;
  }
  clone() {
    return n8.from(this);
  }
  toJSON() {
    let e = (t) => t == null ? null : t.toString();
    return { type: this.type, to: this.to, data: this.data, nonce: this.nonce, gasLimit: e(this.gasLimit), gasPrice: e(this.gasPrice), maxPriorityFeePerGas: e(this.maxPriorityFeePerGas), maxFeePerGas: e(this.maxFeePerGas), value: e(this.value), chainId: e(this.chainId), sig: this.signature ? this.signature.toJSON() : null, accessList: this.accessList };
  }
  [ol]() {
    return this.toString();
  }
  toString() {
    let e = [], t = (s) => {
      let i = this[s];
      typeof i == "string" && (i = JSON.stringify(i)), e.push(`${s}: ${i}`);
    };
    this.type && t("type"), t("to"), t("data"), t("nonce"), t("gasLimit"), t("value"), this.chainId != null && t("chainId"), this.signature && (t("from"), e.push(`signature: ${this.signature.toString()}`));
    let r = this.authorizationList;
    if (r) {
      let s = [];
      for (let i of r) {
        let a = [];
        a.push(`address: ${JSON.stringify(i.address)}`), i.nonce != null && a.push(`nonce: ${i.nonce}`), i.chainId != null && a.push(`chainId: ${i.chainId}`), i.signature && a.push(`signature: ${i.signature.toString()}`), s.push(`Authorization { ${a.join(", ")} }`);
      }
      e.push(`authorizations: [ ${s.join(", ")} ]`);
    }
    return `Transaction { ${e.join(", ")} }`;
  }
  static from(e) {
    if (e == null) return new n8();
    if (typeof e == "string") {
      let r = v(e);
      if (r[0] >= 127) return n8.from(ul(r));
      switch (r[0]) {
        case 1:
          return n8.from(bl(r));
        case 2:
          return n8.from(hl(r));
        case 3:
          return n8.from(gl(r));
        case 4:
          return n8.from(wl(r));
      }
      k(false, "unsupported transaction type", "UNSUPPORTED_OPERATION", { operation: "from" });
    }
    let t = new n8();
    return e.type != null && (t.type = e.type), e.to != null && (t.to = e.to), e.nonce != null && (t.nonce = e.nonce), e.gasLimit != null && (t.gasLimit = e.gasLimit), e.gasPrice != null && (t.gasPrice = e.gasPrice), e.maxPriorityFeePerGas != null && (t.maxPriorityFeePerGas = e.maxPriorityFeePerGas), e.maxFeePerGas != null && (t.maxFeePerGas = e.maxFeePerGas), e.maxFeePerBlobGas != null && (t.maxFeePerBlobGas = e.maxFeePerBlobGas), e.data != null && (t.data = e.data), e.value != null && (t.value = e.value), e.chainId != null && (t.chainId = e.chainId), e.signature != null && (t.signature = Se.from(e.signature)), e.accessList != null && (t.accessList = e.accessList), e.authorizationList != null && (t.authorizationList = e.authorizationList), e.blobVersionedHashes != null && (t.blobVersionedHashes = e.blobVersionedHashes), e.kzg != null && (t.kzg = e.kzg), e.blobWrapperVersion != null && (t.blobWrapperVersion = e.blobWrapperVersion), e.blobs != null && (t.blobs = e.blobs), e.hash != null && (u(t.isSigned(), "unsigned transaction cannot define '.hash'", "tx", e), u(t.hash === e.hash, "hash mismatch", "tx", e)), e.from != null && (u(t.isSigned(), "unsigned transaction cannot define '.from'", "tx", e), u(t.from.toLowerCase() === (e.from || "").toLowerCase(), "from mismatch", "tx", e)), t;
  }
};
function Ui(n31) {
  return u(typeof n31.address == "string", "invalid address for hashAuthorization", "auth.address", n31), z(_(["0x05", Fe([n31.chainId != null ? Y(n31.chainId) : "0x", q(n31.address), n31.nonce != null ? Y(n31.nonce) : "0x"])]));
}
function Te(n31) {
  return z(me(n31));
}
function Di(n31) {
  return typeof n31 == "string" && (n31 = me(n31)), z(_([me(ki), me(String(n31.length)), n31]));
}
var t0 = new Uint8Array(32);
t0.fill(0);
var El = BigInt(-1), n0 = BigInt(0), r0 = BigInt(1), Al = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function Il(n31) {
  let e = v(n31), t = e.length % 32;
  return t ? _([e, t0.slice(t)]) : g(e);
}
var kl = Ne(r0, 32), Sl = Ne(n0, 32), Xo = { name: "string", version: "string", chainId: "uint256", verifyingContract: "address", salt: "bytes32" }, Fi = ["name", "version", "chainId", "verifyingContract", "salt"];
function Qo(n31) {
  return function(e) {
    return u(typeof e == "string", `invalid domain value for ${JSON.stringify(n31)}`, `domain.${n31}`, e), e;
  };
}
var Bl = { name: Qo("name"), version: Qo("version"), chainId: function(n31) {
  let e = D(n31, "domain.chainId");
  return u(e >= 0, "invalid chain ID", "domain.chainId", n31), Number.isSafeInteger(e) ? Number(e) : $r(e);
}, verifyingContract: function(n31) {
  try {
    return q(n31).toLowerCase();
  } catch {
  }
  u(false, 'invalid domain value "verifyingContract"', "domain.verifyingContract", n31);
}, salt: function(n31) {
  let e = v(n31, "domain.salt");
  return u(e.length === 32, 'invalid domain value "salt"', "domain.salt", n31), g(e);
} };
function Gi(n31) {
  {
    let e = n31.match(/^(u?)int(\d+)$/);
    if (e) {
      let t = e[1] === "", r = parseInt(e[2]);
      u(r % 8 === 0 && r !== 0 && r <= 256 && e[2] === String(r), "invalid numeric width", "type", n31);
      let s = We(Al, t ? r - 1 : r), i = t ? (s + r0) * El : n0;
      return function(a) {
        let o = D(a, "value");
        return u(o >= i && o <= s, `value out-of-bounds for ${n31}`, "value", o), Ne(t ? Gn(o, 256) : o, 32);
      };
    }
  }
  {
    let e = n31.match(/^bytes(\d+)$/);
    if (e) {
      let t = parseInt(e[1]);
      return u(t !== 0 && t <= 32 && e[1] === String(t), "invalid bytes width", "type", n31), function(r) {
        let s = v(r);
        return u(s.length === t, `invalid length for ${n31}`, "value", r), Il(r);
      };
    }
  }
  switch (n31) {
    case "address":
      return function(e) {
        return Pe(q(e), 32);
      };
    case "bool":
      return function(e) {
        return e ? kl : Sl;
      };
    case "bytes":
      return function(e) {
        return z(e);
      };
    case "string":
      return function(e) {
        return Te(e);
      };
  }
  return null;
}
function e0(n31, e) {
  return `${n31}(${e.map(({ name: t, type: r }) => r + " " + t).join(",")})`;
}
function Bs(n31) {
  let e = n31.match(/^([^\x5b]*)((\x5b\d*\x5d)*)(\x5b(\d*)\x5d)$/);
  return e ? { base: e[1], index: e[2] + e[4], array: { base: e[1], prefix: e[1] + e[2], count: e[5] ? parseInt(e[5]) : -1 } } : { base: n31 };
}
var jn = class n9 {
  primaryType;
  #e;
  get types() {
    return JSON.parse(this.#e);
  }
  #t;
  #n;
  constructor(e) {
    this.#t = /* @__PURE__ */ new Map(), this.#n = /* @__PURE__ */ new Map();
    let t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), i = {};
    Object.keys(e).forEach((c) => {
      i[c] = e[c].map(({ name: f, type: d }) => {
        let { base: l, index: x } = Bs(d);
        return l === "int" && !e.int && (l = "int256"), l === "uint" && !e.uint && (l = "uint256"), { name: f, type: l + (x || "") };
      }), t.set(c, /* @__PURE__ */ new Set()), r.set(c, []), s.set(c, /* @__PURE__ */ new Set());
    }), this.#e = JSON.stringify(i);
    for (let c in i) {
      let f = /* @__PURE__ */ new Set();
      for (let d of i[c]) {
        u(!f.has(d.name), `duplicate variable name ${JSON.stringify(d.name)} in ${JSON.stringify(c)}`, "types", e), f.add(d.name);
        let l = Bs(d.type).base;
        u(l !== c, `circular type reference to ${JSON.stringify(l)}`, "types", e), !Gi(l) && (u(r.has(l), `unknown type ${JSON.stringify(l)}`, "types", e), r.get(l).push(c), t.get(c).add(l));
      }
    }
    let a = Array.from(r.keys()).filter((c) => r.get(c).length === 0);
    u(a.length !== 0, "missing primary type", "types", e), u(a.length === 1, `ambiguous primary types or unused types: ${a.map((c) => JSON.stringify(c)).join(", ")}`, "types", e), R(this, { primaryType: a[0] });
    function o(c, f) {
      u(!f.has(c), `circular type reference to ${JSON.stringify(c)}`, "types", e), f.add(c);
      for (let d of t.get(c)) if (r.has(d)) {
        o(d, f);
        for (let l of f) s.get(l).add(d);
      }
      f.delete(c);
    }
    o(this.primaryType, /* @__PURE__ */ new Set());
    for (let [c, f] of s) {
      let d = Array.from(f);
      d.sort(), this.#t.set(c, e0(c, i[c]) + d.map((l) => e0(l, i[l])).join(""));
    }
  }
  getEncoder(e) {
    let t = this.#n.get(e);
    return t || (t = this.#r(e), this.#n.set(e, t)), t;
  }
  #r(e) {
    {
      let s = Gi(e);
      if (s) return s;
    }
    let t = Bs(e).array;
    if (t) {
      let s = t.prefix, i = this.getEncoder(s);
      return (a) => {
        u(t.count === -1 || t.count === a.length, `array length mismatch; expected length ${t.count}`, "value", a);
        let o = a.map(i);
        return this.#t.has(s) && (o = o.map(z)), z(_(o));
      };
    }
    let r = this.types[e];
    if (r) {
      let s = Te(this.#t.get(e));
      return (i) => {
        let a = r.map(({ name: o, type: c }) => {
          let f = this.getEncoder(c)(i[o]);
          return this.#t.has(c) ? z(f) : f;
        });
        return a.unshift(s), _(a);
      };
    }
    u(false, `unknown type: ${e}`, "type", e);
  }
  encodeType(e) {
    let t = this.#t.get(e);
    return u(t, `unknown type: ${JSON.stringify(e)}`, "name", e), t;
  }
  encodeData(e, t) {
    return this.getEncoder(e)(t);
  }
  hashStruct(e, t) {
    return z(this.encodeData(e, t));
  }
  encode(e) {
    return this.encodeData(this.primaryType, e);
  }
  hash(e) {
    return this.hashStruct(this.primaryType, e);
  }
  _visit(e, t, r) {
    if (Gi(e)) return r(e, t);
    let s = Bs(e).array;
    if (s) return u(s.count === -1 || s.count === t.length, `array length mismatch; expected length ${s.count}`, "value", t), t.map((a) => this._visit(s.prefix, a, r));
    let i = this.types[e];
    if (i) return i.reduce((a, { name: o, type: c }) => (a[o] = this._visit(c, t[o], r), a), {});
    u(false, `unknown type: ${e}`, "type", e);
  }
  visit(e, t) {
    return this._visit(this.primaryType, e, t);
  }
  static from(e) {
    return new n9(e);
  }
  static getPrimaryType(e) {
    return n9.from(e).primaryType;
  }
  static hashStruct(e, t, r) {
    return n9.from(t).hashStruct(e, r);
  }
  static hashDomain(e) {
    let t = [];
    for (let r in e) {
      if (e[r] == null) continue;
      let s = Xo[r];
      u(s, `invalid typed-data domain key: ${JSON.stringify(r)}`, "domain", e), t.push({ name: r, type: s });
    }
    return t.sort((r, s) => Fi.indexOf(r.name) - Fi.indexOf(s.name)), n9.hashStruct("EIP712Domain", { EIP712Domain: t }, e);
  }
  static encode(e, t, r) {
    return _(["0x1901", n9.hashDomain(e), n9.from(t).hash(r)]);
  }
  static hash(e, t, r) {
    return z(n9.encode(e, t, r));
  }
  static async resolveNames(e, t, r, s) {
    e = Object.assign({}, e);
    for (let o in e) e[o] == null && delete e[o];
    let i = {};
    e.verifyingContract && !fe(e.verifyingContract, 20) && (i[e.verifyingContract] = "0x");
    let a = n9.from(t);
    a.visit(r, (o, c) => (o === "address" && !fe(c, 20) && (i[c] = "0x"), c));
    for (let o in i) i[o] = await s(o);
    return e.verifyingContract && i[e.verifyingContract] && (e.verifyingContract = i[e.verifyingContract]), r = a.visit(r, (o, c) => o === "address" && i[c] ? i[c] : c), { domain: e, value: r };
  }
  static getPayload(e, t, r) {
    n9.hashDomain(e);
    let s = {}, i = [];
    Fi.forEach((c) => {
      let f = e[c];
      f != null && (s[c] = Bl[c](f), i.push({ name: c, type: Xo[c] }));
    });
    let a = n9.from(t);
    t = a.types;
    let o = Object.assign({}, t);
    return u(o.EIP712Domain == null, "types must not contain EIP712Domain type", "types.EIP712Domain", t), o.EIP712Domain = i, a.encode(r), { types: o, domain: s, primaryType: a.primaryType, message: a.visit(r, (c, f) => {
      if (c.match(/^bytes(\d*)/)) return g(v(f));
      if (c.match(/^u?int/)) return D(f).toString();
      switch (c) {
        case "address":
          return f.toLowerCase();
        case "bool":
          return !!f;
        case "string":
          return u(typeof f == "string", "invalid string", "value", f), f;
      }
      u(false, "unsupported type", "type", c);
    }) };
  }
};
function Re(n31) {
  let e = /* @__PURE__ */ new Set();
  return n31.forEach((t) => e.add(t)), Object.freeze(e);
}
var Pl = "external public payable override", Nl = Re(Pl.split(" ")), x0 = "constant external internal payable private public pure view override", Tl = Re(x0.split(" ")), h0 = "constructor error event fallback function receive struct", p0 = Re(h0.split(" ")), b0 = "calldata memory storage payable indexed", Rl = Re(b0.split(" ")), Ol = "tuple returns", Cl = [h0, b0, Ol, x0].join(" "), Ll = Re(Cl.split(" ")), Ul = { "(": "OPEN_PAREN", ")": "CLOSE_PAREN", "[": "OPEN_BRACKET", "]": "CLOSE_BRACKET", ",": "COMMA", "@": "AT" }, Dl = new RegExp("^(\\s*)"), Fl = new RegExp("^([0-9]+)"), Gl = new RegExp("^([a-zA-Z$_][a-zA-Z0-9$_]*)"), m0 = new RegExp("^([a-zA-Z$_][a-zA-Z0-9$_]*)$"), g0 = new RegExp("^(address|bool|bytes([0-9]*)|string|u?int([0-9]*))$"), it = class n10 {
  #e;
  #t;
  get offset() {
    return this.#e;
  }
  get length() {
    return this.#t.length - this.#e;
  }
  constructor(e) {
    this.#e = 0, this.#t = e.slice();
  }
  clone() {
    return new n10(this.#t);
  }
  reset() {
    this.#e = 0;
  }
  #n(e = 0, t = 0) {
    return new n10(this.#t.slice(e, t).map((r) => Object.freeze(Object.assign({}, r, { match: r.match - e, linkBack: r.linkBack - e, linkNext: r.linkNext - e }))));
  }
  popKeyword(e) {
    let t = this.peek();
    if (t.type !== "KEYWORD" || !e.has(t.text)) throw new Error(`expected keyword ${t.text}`);
    return this.pop().text;
  }
  popType(e) {
    if (this.peek().type !== e) {
      let t = this.peek();
      throw new Error(`expected ${e}; got ${t.type} ${JSON.stringify(t.text)}`);
    }
    return this.pop().text;
  }
  popParen() {
    let e = this.peek();
    if (e.type !== "OPEN_PAREN") throw new Error("bad start");
    let t = this.#n(this.#e + 1, e.match + 1);
    return this.#e = e.match + 1, t;
  }
  popParams() {
    let e = this.peek();
    if (e.type !== "OPEN_PAREN") throw new Error("bad start");
    let t = [];
    for (; this.#e < e.match - 1; ) {
      let r = this.peek().linkNext;
      t.push(this.#n(this.#e + 1, r)), this.#e = r;
    }
    return this.#e = e.match + 1, t;
  }
  peek() {
    if (this.#e >= this.#t.length) throw new Error("out-of-bounds");
    return this.#t[this.#e];
  }
  peekKeyword(e) {
    let t = this.peekType("KEYWORD");
    return t != null && e.has(t) ? t : null;
  }
  peekType(e) {
    if (this.length === 0) return null;
    let t = this.peek();
    return t.type === e ? t.text : null;
  }
  pop() {
    let e = this.peek();
    return this.#e++, e;
  }
  toString() {
    let e = [];
    for (let t = this.#e; t < this.#t.length; t++) {
      let r = this.#t[t];
      e.push(`${r.type}:${r.text}`);
    }
    return `<TokenString ${e.join(" ")}>`;
  }
};
function nn(n31) {
  let e = [], t = (a) => {
    let o = i < n31.length ? JSON.stringify(n31[i]) : "$EOI";
    throw new Error(`invalid token ${o} at ${i}: ${a}`);
  }, r = [], s = [], i = 0;
  for (; i < n31.length; ) {
    let a = n31.substring(i), o = a.match(Dl);
    o && (i += o[1].length, a = n31.substring(i));
    let c = { depth: r.length, linkBack: -1, linkNext: -1, match: -1, type: "", text: "", offset: i, value: -1 };
    e.push(c);
    let f = Ul[a[0]] || "";
    if (f) {
      if (c.type = f, c.text = a[0], i++, f === "OPEN_PAREN") r.push(e.length - 1), s.push(e.length - 1);
      else if (f == "CLOSE_PAREN") r.length === 0 && t("no matching open bracket"), c.match = r.pop(), e[c.match].match = e.length - 1, c.depth--, c.linkBack = s.pop(), e[c.linkBack].linkNext = e.length - 1;
      else if (f === "COMMA") c.linkBack = s.pop(), e[c.linkBack].linkNext = e.length - 1, s.push(e.length - 1);
      else if (f === "OPEN_BRACKET") c.type = "BRACKET";
      else if (f === "CLOSE_BRACKET") {
        let d = e.pop().text;
        if (e.length > 0 && e[e.length - 1].type === "NUMBER") {
          let l = e.pop().text;
          d = l + d, e[e.length - 1].value = K(l);
        }
        if (e.length === 0 || e[e.length - 1].type !== "BRACKET") throw new Error("missing opening bracket");
        e[e.length - 1].text += d;
      }
      continue;
    }
    if (o = a.match(Gl), o) {
      if (c.text = o[1], i += c.text.length, Ll.has(c.text)) {
        c.type = "KEYWORD";
        continue;
      }
      if (c.text.match(g0)) {
        c.type = "TYPE";
        continue;
      }
      c.type = "ID";
      continue;
    }
    if (o = a.match(Fl), o) {
      c.text = o[1], c.type = "NUMBER", i += c.text.length;
      continue;
    }
    throw new Error(`unexpected token ${JSON.stringify(a[0])} at position ${i}`);
  }
  return new it(e.map((a) => Object.freeze(a)));
}
function s0(n31, e) {
  let t = [];
  for (let r in e.keys()) n31.has(r) && t.push(r);
  if (t.length > 1) throw new Error(`conflicting types: ${t.join(", ")}`);
}
function Ps(n31, e) {
  if (e.peekKeyword(p0)) {
    let t = e.pop().text;
    if (t !== n31) throw new Error(`expected ${n31}, got ${t}`);
  }
  return e.popType("ID");
}
function Nt(n31, e) {
  let t = /* @__PURE__ */ new Set();
  for (; ; ) {
    let r = n31.peekType("KEYWORD");
    if (r == null || e && !e.has(r)) break;
    if (n31.pop(), t.has(r)) throw new Error(`duplicate keywords: ${JSON.stringify(r)}`);
    t.add(r);
  }
  return Object.freeze(t);
}
function y0(n31) {
  let e = Nt(n31, Tl);
  return s0(e, Re("constant payable nonpayable".split(" "))), s0(e, Re("pure view payable nonpayable".split(" "))), e.has("view") ? "view" : e.has("pure") ? "pure" : e.has("payable") ? "payable" : e.has("nonpayable") ? "nonpayable" : e.has("constant") ? "view" : "nonpayable";
}
function Pt(n31, e) {
  return n31.popParams().map((t) => xe.from(t, e));
}
function w0(n31) {
  if (n31.peekType("AT")) {
    if (n31.pop(), n31.peekType("NUMBER")) return D(n31.pop().text);
    throw new Error("invalid gas");
  }
  return null;
}
function yn(n31) {
  if (n31.length) throw new Error(`unexpected tokens at offset ${n31.offset}: ${n31.toString()}`);
}
var _l = new RegExp(/^(.*)\[([0-9]*)\]$/);
function i0(n31) {
  let e = n31.match(g0);
  if (u(e, "invalid type", "type", n31), n31 === "uint") return "uint256";
  if (n31 === "int") return "int256";
  if (e[2]) {
    let t = parseInt(e[2]);
    u(t !== 0 && t <= 32, "invalid bytes length", "type", n31);
  } else if (e[3]) {
    let t = parseInt(e[3]);
    u(t !== 0 && t <= 256 && t % 8 === 0, "invalid numeric width", "type", n31);
  }
  return n31;
}
var ie = {}, Ce = Symbol.for("_ethers_internal"), a0 = "_ParamTypeInternal", o0 = "_ErrorInternal", c0 = "_EventInternal", f0 = "_ConstructorInternal", l0 = "_FallbackInternal", d0 = "_FunctionInternal", u0 = "_StructInternal", xe = class n11 {
  name;
  type;
  baseType;
  indexed;
  components;
  arrayLength;
  arrayChildren;
  constructor(e, t, r, s, i, a, o, c) {
    if (Ae(e, ie, "ParamType"), Object.defineProperty(this, Ce, { value: a0 }), a && (a = Object.freeze(a.slice())), s === "array") {
      if (o == null || c == null) throw new Error("");
    } else if (o != null || c != null) throw new Error("");
    if (s === "tuple") {
      if (a == null) throw new Error("");
    } else if (a != null) throw new Error("");
    R(this, { name: t, type: r, baseType: s, indexed: i, components: a, arrayLength: o, arrayChildren: c });
  }
  format(e) {
    if (e == null && (e = "sighash"), e === "json") {
      let r = this.name || "";
      if (this.isArray()) {
        let i = JSON.parse(this.arrayChildren.format("json"));
        return i.name = r, i.type += `[${this.arrayLength < 0 ? "" : String(this.arrayLength)}]`, JSON.stringify(i);
      }
      let s = { type: this.baseType === "tuple" ? "tuple" : this.type, name: r };
      return typeof this.indexed == "boolean" && (s.indexed = this.indexed), this.isTuple() && (s.components = this.components.map((i) => JSON.parse(i.format(e)))), JSON.stringify(s);
    }
    let t = "";
    return this.isArray() ? (t += this.arrayChildren.format(e), t += `[${this.arrayLength < 0 ? "" : String(this.arrayLength)}]`) : this.isTuple() ? t += "(" + this.components.map((r) => r.format(e)).join(e === "full" ? ", " : ",") + ")" : t += this.type, e !== "sighash" && (this.indexed === true && (t += " indexed"), e === "full" && this.name && (t += " " + this.name)), t;
  }
  isArray() {
    return this.baseType === "array";
  }
  isTuple() {
    return this.baseType === "tuple";
  }
  isIndexable() {
    return this.indexed != null;
  }
  walk(e, t) {
    if (this.isArray()) {
      if (!Array.isArray(e)) throw new Error("invalid array value");
      if (this.arrayLength !== -1 && e.length !== this.arrayLength) throw new Error("array is wrong length");
      let r = this;
      return e.map((s) => r.arrayChildren.walk(s, t));
    }
    if (this.isTuple()) {
      if (!Array.isArray(e)) throw new Error("invalid tuple value");
      if (e.length !== this.components.length) throw new Error("array is wrong length");
      let r = this;
      return e.map((s, i) => r.components[i].walk(s, t));
    }
    return t(this.type, e);
  }
  #e(e, t, r, s) {
    if (this.isArray()) {
      if (!Array.isArray(t)) throw new Error("invalid array value");
      if (this.arrayLength !== -1 && t.length !== this.arrayLength) throw new Error("array is wrong length");
      let a = this.arrayChildren, o = t.slice();
      o.forEach((c, f) => {
        a.#e(e, c, r, (d) => {
          o[f] = d;
        });
      }), s(o);
      return;
    }
    if (this.isTuple()) {
      let a = this.components, o;
      if (Array.isArray(t)) o = t.slice();
      else {
        if (t == null || typeof t != "object") throw new Error("invalid tuple value");
        o = a.map((c) => {
          if (!c.name) throw new Error("cannot use object value with unnamed components");
          if (!(c.name in t)) throw new Error(`missing value for component ${c.name}`);
          return t[c.name];
        });
      }
      if (o.length !== this.components.length) throw new Error("array is wrong length");
      o.forEach((c, f) => {
        a[f].#e(e, c, r, (d) => {
          o[f] = d;
        });
      }), s(o);
      return;
    }
    let i = r(this.type, t);
    i.then ? e.push((async function() {
      s(await i);
    })()) : s(i);
  }
  async walkAsync(e, t) {
    let r = [], s = [e];
    return this.#e(r, e, t, (i) => {
      s[0] = i;
    }), r.length && await Promise.all(r), s[0];
  }
  static from(e, t) {
    if (n11.isParamType(e)) return e;
    if (typeof e == "string") try {
      return n11.from(nn(e), t);
    } catch {
      u(false, "invalid param type", "obj", e);
    }
    else if (e instanceof it) {
      let o = "", c = "", f = null;
      Nt(e, Re(["tuple"])).has("tuple") || e.peekType("OPEN_PAREN") ? (c = "tuple", f = e.popParams().map((h) => n11.from(h)), o = `tuple(${f.map((h) => h.format()).join(",")})`) : (o = i0(e.popType("TYPE")), c = o);
      let d = null, l = null;
      for (; e.length && e.peekType("BRACKET"); ) {
        let h = e.pop();
        d = new n11(ie, "", o, c, null, f, l, d), l = h.value, o += h.text, c = "array", f = null;
      }
      let x = null;
      if (Nt(e, Rl).has("indexed")) {
        if (!t) throw new Error("");
        x = true;
      }
      let b = e.peekType("ID") ? e.pop().text : "";
      if (e.length) throw new Error("leftover tokens");
      return new n11(ie, b, o, c, x, f, l, d);
    }
    let r = e.name;
    u(!r || typeof r == "string" && r.match(m0), "invalid name", "obj.name", r);
    let s = e.indexed;
    s != null && (u(t, "parameter cannot be indexed", "obj.indexed", e.indexed), s = !!s);
    let i = e.type, a = i.match(_l);
    if (a) {
      let o = parseInt(a[2] || "-1"), c = n11.from({ type: a[1], components: e.components });
      return new n11(ie, r || "", i, "array", s, null, o, c);
    }
    if (i === "tuple" || i.startsWith("tuple(") || i.startsWith("(")) {
      let o = e.components != null ? e.components.map((f) => n11.from(f)) : null;
      return new n11(ie, r || "", i, "tuple", s, o, null, null);
    }
    return i = i0(e.type), new n11(ie, r || "", i, i, s, null, null, null);
  }
  static isParamType(e) {
    return e && e[Ce] === a0;
  }
}, tn = class n12 {
  type;
  inputs;
  constructor(e, t, r) {
    Ae(e, ie, "Fragment"), r = Object.freeze(r.slice()), R(this, { type: t, inputs: r });
  }
  static from(e) {
    if (typeof e == "string") {
      try {
        n12.from(JSON.parse(e));
      } catch {
      }
      return n12.from(nn(e));
    }
    if (e instanceof it) switch (e.peekKeyword(p0)) {
      case "constructor":
        return Qt.from(e);
      case "error":
        return ze.from(e);
      case "event":
        return Xt.from(e);
      case "fallback":
      case "receive":
        return wr.from(e);
      case "function":
        return en.from(e);
      case "struct":
        return Zn.from(e);
    }
    else if (typeof e == "object") {
      switch (e.type) {
        case "constructor":
          return Qt.from(e);
        case "error":
          return ze.from(e);
        case "event":
          return Xt.from(e);
        case "fallback":
        case "receive":
          return wr.from(e);
        case "function":
          return en.from(e);
        case "struct":
          return Zn.from(e);
      }
      k(false, `unsupported type: ${e.type}`, "UNSUPPORTED_OPERATION", { operation: "Fragment.from" });
    }
    u(false, "unsupported frgament object", "obj", e);
  }
  static isConstructor(e) {
    return Qt.isFragment(e);
  }
  static isError(e) {
    return ze.isFragment(e);
  }
  static isEvent(e) {
    return Xt.isFragment(e);
  }
  static isFunction(e) {
    return en.isFragment(e);
  }
  static isStruct(e) {
    return Zn.isFragment(e);
  }
}, wn = class extends tn {
  name;
  constructor(e, t, r, s) {
    super(e, t, s), u(typeof r == "string" && r.match(m0), "invalid identifier", "name", r), s = Object.freeze(s.slice()), R(this, { name: r });
  }
};
function yr(n31, e) {
  return "(" + e.map((t) => t.format(n31)).join(n31 === "full" ? ", " : ",") + ")";
}
var ze = class n13 extends wn {
  constructor(e, t, r) {
    super(e, "error", t, r), Object.defineProperty(this, Ce, { value: o0 });
  }
  get selector() {
    return Te(this.format("sighash")).substring(0, 10);
  }
  format(e) {
    if (e == null && (e = "sighash"), e === "json") return JSON.stringify({ type: "error", name: this.name, inputs: this.inputs.map((r) => JSON.parse(r.format(e))) });
    let t = [];
    return e !== "sighash" && t.push("error"), t.push(this.name + yr(e, this.inputs)), t.join(" ");
  }
  static from(e) {
    if (n13.isFragment(e)) return e;
    if (typeof e == "string") return n13.from(nn(e));
    if (e instanceof it) {
      let t = Ps("error", e), r = Pt(e);
      return yn(e), new n13(ie, t, r);
    }
    return new n13(ie, e.name, e.inputs ? e.inputs.map(xe.from) : []);
  }
  static isFragment(e) {
    return e && e[Ce] === o0;
  }
}, Xt = class n14 extends wn {
  anonymous;
  constructor(e, t, r, s) {
    super(e, "event", t, r), Object.defineProperty(this, Ce, { value: c0 }), R(this, { anonymous: s });
  }
  get topicHash() {
    return Te(this.format("sighash"));
  }
  format(e) {
    if (e == null && (e = "sighash"), e === "json") return JSON.stringify({ type: "event", anonymous: this.anonymous, name: this.name, inputs: this.inputs.map((r) => JSON.parse(r.format(e))) });
    let t = [];
    return e !== "sighash" && t.push("event"), t.push(this.name + yr(e, this.inputs)), e !== "sighash" && this.anonymous && t.push("anonymous"), t.join(" ");
  }
  static getTopicHash(e, t) {
    return t = (t || []).map((s) => xe.from(s)), new n14(ie, e, t, false).topicHash;
  }
  static from(e) {
    if (n14.isFragment(e)) return e;
    if (typeof e == "string") try {
      return n14.from(nn(e));
    } catch {
      u(false, "invalid event fragment", "obj", e);
    }
    else if (e instanceof it) {
      let t = Ps("event", e), r = Pt(e, true), s = !!Nt(e, Re(["anonymous"])).has("anonymous");
      return yn(e), new n14(ie, t, r, s);
    }
    return new n14(ie, e.name, e.inputs ? e.inputs.map((t) => xe.from(t, true)) : [], !!e.anonymous);
  }
  static isFragment(e) {
    return e && e[Ce] === c0;
  }
}, Qt = class n15 extends tn {
  payable;
  gas;
  constructor(e, t, r, s, i) {
    super(e, t, r), Object.defineProperty(this, Ce, { value: f0 }), R(this, { payable: s, gas: i });
  }
  format(e) {
    if (k(e != null && e !== "sighash", "cannot format a constructor for sighash", "UNSUPPORTED_OPERATION", { operation: "format(sighash)" }), e === "json") return JSON.stringify({ type: "constructor", stateMutability: this.payable ? "payable" : "undefined", payable: this.payable, gas: this.gas != null ? this.gas : void 0, inputs: this.inputs.map((r) => JSON.parse(r.format(e))) });
    let t = [`constructor${yr(e, this.inputs)}`];
    return this.payable && t.push("payable"), this.gas != null && t.push(`@${this.gas.toString()}`), t.join(" ");
  }
  static from(e) {
    if (n15.isFragment(e)) return e;
    if (typeof e == "string") try {
      return n15.from(nn(e));
    } catch {
      u(false, "invalid constuctor fragment", "obj", e);
    }
    else if (e instanceof it) {
      Nt(e, Re(["constructor"]));
      let t = Pt(e), r = !!Nt(e, Nl).has("payable"), s = w0(e);
      return yn(e), new n15(ie, "constructor", t, r, s);
    }
    return new n15(ie, "constructor", e.inputs ? e.inputs.map(xe.from) : [], !!e.payable, e.gas != null ? e.gas : null);
  }
  static isFragment(e) {
    return e && e[Ce] === f0;
  }
}, wr = class n16 extends tn {
  payable;
  constructor(e, t, r) {
    super(e, "fallback", t), Object.defineProperty(this, Ce, { value: l0 }), R(this, { payable: r });
  }
  format(e) {
    let t = this.inputs.length === 0 ? "receive" : "fallback";
    if (e === "json") {
      let r = this.payable ? "payable" : "nonpayable";
      return JSON.stringify({ type: t, stateMutability: r });
    }
    return `${t}()${this.payable ? " payable" : ""}`;
  }
  static from(e) {
    if (n16.isFragment(e)) return e;
    if (typeof e == "string") try {
      return n16.from(nn(e));
    } catch {
      u(false, "invalid fallback fragment", "obj", e);
    }
    else if (e instanceof it) {
      let t = e.toString(), r = e.peekKeyword(Re(["fallback", "receive"]));
      if (u(r, "type must be fallback or receive", "obj", t), e.popKeyword(Re(["fallback", "receive"])) === "receive") {
        let o = Pt(e);
        return u(o.length === 0, "receive cannot have arguments", "obj.inputs", o), Nt(e, Re(["payable"])), yn(e), new n16(ie, [], true);
      }
      let i = Pt(e);
      i.length ? u(i.length === 1 && i[0].type === "bytes", "invalid fallback inputs", "obj.inputs", i.map((o) => o.format("minimal")).join(", ")) : i = [xe.from("bytes")];
      let a = y0(e);
      if (u(a === "nonpayable" || a === "payable", "fallback cannot be constants", "obj.stateMutability", a), Nt(e, Re(["returns"])).has("returns")) {
        let o = Pt(e);
        u(o.length === 1 && o[0].type === "bytes", "invalid fallback outputs", "obj.outputs", o.map((c) => c.format("minimal")).join(", "));
      }
      return yn(e), new n16(ie, i, a === "payable");
    }
    if (e.type === "receive") return new n16(ie, [], true);
    if (e.type === "fallback") {
      let t = [xe.from("bytes")], r = e.stateMutability === "payable";
      return new n16(ie, t, r);
    }
    u(false, "invalid fallback description", "obj", e);
  }
  static isFragment(e) {
    return e && e[Ce] === l0;
  }
}, en = class n17 extends wn {
  constant;
  outputs;
  stateMutability;
  payable;
  gas;
  constructor(e, t, r, s, i, a) {
    super(e, "function", t, s), Object.defineProperty(this, Ce, { value: d0 }), i = Object.freeze(i.slice()), R(this, { constant: r === "view" || r === "pure", gas: a, outputs: i, payable: r === "payable", stateMutability: r });
  }
  get selector() {
    return Te(this.format("sighash")).substring(0, 10);
  }
  format(e) {
    if (e == null && (e = "sighash"), e === "json") return JSON.stringify({ type: "function", name: this.name, constant: this.constant, stateMutability: this.stateMutability !== "nonpayable" ? this.stateMutability : void 0, payable: this.payable, gas: this.gas != null ? this.gas : void 0, inputs: this.inputs.map((r) => JSON.parse(r.format(e))), outputs: this.outputs.map((r) => JSON.parse(r.format(e))) });
    let t = [];
    return e !== "sighash" && t.push("function"), t.push(this.name + yr(e, this.inputs)), e !== "sighash" && (this.stateMutability !== "nonpayable" && t.push(this.stateMutability), this.outputs && this.outputs.length && (t.push("returns"), t.push(yr(e, this.outputs))), this.gas != null && t.push(`@${this.gas.toString()}`)), t.join(" ");
  }
  static getSelector(e, t) {
    return t = (t || []).map((s) => xe.from(s)), new n17(ie, e, "view", t, [], null).selector;
  }
  static from(e) {
    if (n17.isFragment(e)) return e;
    if (typeof e == "string") try {
      return n17.from(nn(e));
    } catch {
      u(false, "invalid function fragment", "obj", e);
    }
    else if (e instanceof it) {
      let r = Ps("function", e), s = Pt(e), i = y0(e), a = [];
      Nt(e, Re(["returns"])).has("returns") && (a = Pt(e));
      let o = w0(e);
      return yn(e), new n17(ie, r, i, s, a, o);
    }
    let t = e.stateMutability;
    return t == null && (t = "payable", typeof e.constant == "boolean" ? (t = "view", e.constant || (t = "payable", typeof e.payable == "boolean" && !e.payable && (t = "nonpayable"))) : typeof e.payable == "boolean" && !e.payable && (t = "nonpayable")), new n17(ie, e.name, t, e.inputs ? e.inputs.map(xe.from) : [], e.outputs ? e.outputs.map(xe.from) : [], e.gas != null ? e.gas : null);
  }
  static isFragment(e) {
    return e && e[Ce] === d0;
  }
}, Zn = class n18 extends wn {
  constructor(e, t, r) {
    super(e, "struct", t, r), Object.defineProperty(this, Ce, { value: u0 });
  }
  format() {
    throw new Error("@TODO");
  }
  static from(e) {
    if (typeof e == "string") try {
      return n18.from(nn(e));
    } catch {
      u(false, "invalid struct fragment", "obj", e);
    }
    else if (e instanceof it) {
      let t = Ps("struct", e), r = Pt(e);
      return yn(e), new n18(ie, t, r);
    }
    return new n18(ie, e.name, e.inputs ? e.inputs.map(xe.from) : []);
  }
  static isFragment(e) {
    return e && e[Ce] === u0;
  }
};
var at = /* @__PURE__ */ new Map();
at.set(0, "GENERIC_PANIC");
at.set(1, "ASSERT_FALSE");
at.set(17, "OVERFLOW");
at.set(18, "DIVIDE_BY_ZERO");
at.set(33, "ENUM_RANGE_ERROR");
at.set(34, "BAD_STORAGE_DATA");
at.set(49, "STACK_UNDERFLOW");
at.set(50, "ARRAY_RANGE_ERROR");
at.set(65, "OUT_OF_MEMORY");
at.set(81, "UNINITIALIZED_FUNCTION_CALL");
var $l = new RegExp(/^bytes([0-9]*)$/), Ml = new RegExp(/^(u?int)([0-9]*)$/), _i = null, v0 = 1024;
function zl(n31, e, t, r) {
  let s = "missing revert data", i = null, a = null, o = null;
  if (t) {
    s = "execution reverted";
    let f = v(t);
    if (t = g(t), f.length === 0) s += " (no data present; likely require(false) occurred", i = "require(false)";
    else if (f.length % 32 !== 4) s += " (could not decode reason; invalid data length)";
    else if (g(f.slice(0, 4)) === "0x08c379a0") try {
      i = r.decode(["string"], f.slice(4))[0], o = { signature: "Error(string)", name: "Error", args: [i] }, s += `: ${JSON.stringify(i)}`;
    } catch {
      s += " (could not decode reason; invalid string data)";
    }
    else if (g(f.slice(0, 4)) === "0x4e487b71") try {
      let d = Number(r.decode(["uint256"], f.slice(4))[0]);
      o = { signature: "Panic(uint256)", name: "Panic", args: [d] }, i = `Panic due to ${at.get(d) || "UNKNOWN"}(${d})`, s += `: ${i}`;
    } catch {
      s += " (could not decode panic code)";
    }
    else s += " (unknown custom error)";
  }
  let c = { to: e.to ? q(e.to) : null, data: e.data || "0x" };
  return e.from && (c.from = q(e.from)), Ln(s, "CALL_EXCEPTION", { action: n31, data: t, reason: i, transaction: c, invocation: a, revert: o });
}
var Yn = class n19 {
  #e(e) {
    if (e.isArray()) return new ps(this.#e(e.arrayChildren), e.arrayLength, e.name);
    if (e.isTuple()) return new mn(e.components.map((r) => this.#e(r)), e.name);
    switch (e.baseType) {
      case "address":
        return new xs(e.name);
      case "bool":
        return new bs(e.name);
      case "string":
        return new vs(e.name);
      case "bytes":
        return new ms(e.name);
      case "":
        return new ys(e.name);
    }
    let t = e.type.match(Ml);
    if (t) {
      let r = parseInt(t[2] || "256");
      return u(r !== 0 && r <= 256 && r % 8 === 0, "invalid " + t[1] + " bit length", "param", e), new ws(r / 8, t[1] === "int", e.name);
    }
    if (t = e.type.match($l), t) {
      let r = parseInt(t[1]);
      return u(r !== 0 && r <= 32, "invalid bytes length", "param", e), new gs(r, e.name);
    }
    u(false, "invalid type", "type", e.type);
  }
  getDefaultValue(e) {
    let t = e.map((s) => this.#e(xe.from(s)));
    return new mn(t, "_").defaultValue();
  }
  encode(e, t) {
    Un(t.length, e.length, "types/values length mismatch");
    let r = e.map((a) => this.#e(xe.from(a))), s = new mn(r, "_"), i = new ln();
    return s.encode(i, t), i.data;
  }
  decode(e, t, r) {
    let s = e.map((a) => this.#e(xe.from(a)));
    return new mn(s, "_").decode(new qr(t, r, v0));
  }
  static _setDefaultMaxInflation(e) {
    u(typeof e == "number" && Number.isInteger(e), "invalid defaultMaxInflation factor", "value", e), v0 = e;
  }
  static defaultAbiCoder() {
    return _i == null && (_i = new n19()), _i;
  }
  static getBuiltinCallException(e, t, r) {
    return zl(e, t, r, n19.defaultAbiCoder());
  }
};
var vr = class {
  fragment;
  name;
  signature;
  topic;
  args;
  constructor(e, t, r) {
    let s = e.name, i = e.format();
    R(this, { fragment: e, name: s, signature: i, topic: t, args: r });
  }
}, Er = class {
  fragment;
  name;
  args;
  signature;
  selector;
  value;
  constructor(e, t, r, s) {
    let i = e.name, a = e.format();
    R(this, { fragment: e, name: i, args: r, signature: a, selector: t, value: s });
  }
}, Ar = class {
  fragment;
  name;
  args;
  signature;
  selector;
  constructor(e, t, r) {
    let s = e.name, i = e.format();
    R(this, { fragment: e, name: s, args: r, signature: i, selector: t });
  }
}, Xn = class {
  hash;
  _isIndexed;
  static isIndexed(e) {
    return !!(e && e._isIndexed);
  }
  constructor(e) {
    R(this, { hash: e, _isIndexed: true });
  }
}, E0 = { 0: "generic panic", 1: "assert(false)", 17: "arithmetic overflow", 18: "division or modulo by zero", 33: "enum overflow", 34: "invalid encoded storage byte array accessed", 49: "out-of-bounds array access; popping on an empty array", 50: "out-of-bounds access of an array or bytesN", 65: "out of memory", 81: "uninitialized function" }, A0 = { "0x08c379a0": { signature: "Error(string)", name: "Error", inputs: ["string"], reason: (n31) => `reverted with reason string ${JSON.stringify(n31)}` }, "0x4e487b71": { signature: "Panic(uint256)", name: "Panic", inputs: ["uint256"], reason: (n31) => {
  let e = "unknown panic code";
  return n31 >= 0 && n31 <= 255 && E0[n31.toString()] && (e = E0[n31.toString()]), `reverted with panic code 0x${n31.toString(16)} (${e})`;
} } }, vn = class n20 {
  fragments;
  deploy;
  fallback;
  receive;
  #e;
  #t;
  #n;
  #r;
  constructor(e) {
    let t = [];
    typeof e == "string" ? t = JSON.parse(e) : t = e, this.#n = /* @__PURE__ */ new Map(), this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new Map();
    let r = [];
    for (let a of t) try {
      r.push(tn.from(a));
    } catch (o) {
      console.log(`[Warning] Invalid Fragment ${JSON.stringify(a)}:`, o.message);
    }
    R(this, { fragments: Object.freeze(r) });
    let s = null, i = false;
    this.#r = this.getAbiCoder(), this.fragments.forEach((a, o) => {
      let c;
      switch (a.type) {
        case "constructor":
          if (this.deploy) {
            console.log("duplicate definition - constructor");
            return;
          }
          R(this, { deploy: a });
          return;
        case "fallback":
          a.inputs.length === 0 ? i = true : (u(!s || a.payable !== s.payable, "conflicting fallback fragments", `fragments[${o}]`, a), s = a, i = s.payable);
          return;
        case "function":
          c = this.#n;
          break;
        case "event":
          c = this.#t;
          break;
        case "error":
          c = this.#e;
          break;
        default:
          return;
      }
      let f = a.format();
      c.has(f) || c.set(f, a);
    }), this.deploy || R(this, { deploy: Qt.from("constructor()") }), R(this, { fallback: s, receive: i });
  }
  format(e) {
    let t = e ? "minimal" : "full";
    return this.fragments.map((s) => s.format(t));
  }
  formatJson() {
    let e = this.fragments.map((t) => t.format("json"));
    return JSON.stringify(e.map((t) => JSON.parse(t)));
  }
  getAbiCoder() {
    return Yn.defaultAbiCoder();
  }
  #s(e, t, r) {
    if (fe(e)) {
      let i = e.toLowerCase();
      for (let a of this.#n.values()) if (i === a.selector) return a;
      return null;
    }
    if (e.indexOf("(") === -1) {
      let i = [];
      for (let [a, o] of this.#n) a.split("(")[0] === e && i.push(o);
      if (t) {
        let a = t.length > 0 ? t[t.length - 1] : null, o = t.length, c = true;
        se.isTyped(a) && a.type === "overrides" && (c = false, o--);
        for (let f = i.length - 1; f >= 0; f--) {
          let d = i[f].inputs.length;
          d !== o && (!c || d !== o - 1) && i.splice(f, 1);
        }
        for (let f = i.length - 1; f >= 0; f--) {
          let d = i[f].inputs;
          for (let l = 0; l < t.length; l++) if (se.isTyped(t[l])) {
            if (l >= d.length) {
              if (t[l].type === "overrides") continue;
              i.splice(f, 1);
              break;
            }
            if (t[l].type !== d[l].baseType) {
              i.splice(f, 1);
              break;
            }
          }
        }
      }
      if (i.length === 1 && t && t.length !== i[0].inputs.length) {
        let a = t[t.length - 1];
        (a == null || Array.isArray(a) || typeof a != "object") && i.splice(0, 1);
      }
      if (i.length === 0) return null;
      if (i.length > 1 && r) {
        let a = i.map((o) => JSON.stringify(o.format())).join(", ");
        u(false, `ambiguous function description (i.e. matches ${a})`, "key", e);
      }
      return i[0];
    }
    let s = this.#n.get(en.from(e).format());
    return s || null;
  }
  getFunctionName(e) {
    let t = this.#s(e, null, false);
    return u(t, "no matching function", "key", e), t.name;
  }
  hasFunction(e) {
    return !!this.#s(e, null, false);
  }
  getFunction(e, t) {
    return this.#s(e, t || null, true);
  }
  forEachFunction(e) {
    let t = Array.from(this.#n.keys());
    t.sort((r, s) => r.localeCompare(s));
    for (let r = 0; r < t.length; r++) {
      let s = t[r];
      e(this.#n.get(s), r);
    }
  }
  #i(e, t, r) {
    if (fe(e)) {
      let i = e.toLowerCase();
      for (let a of this.#t.values()) if (i === a.topicHash) return a;
      return null;
    }
    if (e.indexOf("(") === -1) {
      let i = [];
      for (let [a, o] of this.#t) a.split("(")[0] === e && i.push(o);
      if (t) {
        for (let a = i.length - 1; a >= 0; a--) i[a].inputs.length < t.length && i.splice(a, 1);
        for (let a = i.length - 1; a >= 0; a--) {
          let o = i[a].inputs;
          for (let c = 0; c < t.length; c++) if (se.isTyped(t[c]) && t[c].type !== o[c].baseType) {
            i.splice(a, 1);
            break;
          }
        }
      }
      if (i.length === 0) return null;
      if (i.length > 1 && r) {
        let a = i.map((o) => JSON.stringify(o.format())).join(", ");
        u(false, `ambiguous event description (i.e. matches ${a})`, "key", e);
      }
      return i[0];
    }
    let s = this.#t.get(Xt.from(e).format());
    return s || null;
  }
  getEventName(e) {
    let t = this.#i(e, null, false);
    return u(t, "no matching event", "key", e), t.name;
  }
  hasEvent(e) {
    return !!this.#i(e, null, false);
  }
  getEvent(e, t) {
    return this.#i(e, t || null, true);
  }
  forEachEvent(e) {
    let t = Array.from(this.#t.keys());
    t.sort((r, s) => r.localeCompare(s));
    for (let r = 0; r < t.length; r++) {
      let s = t[r];
      e(this.#t.get(s), r);
    }
  }
  getError(e, t) {
    if (fe(e)) {
      let s = e.toLowerCase();
      if (A0[s]) return ze.from(A0[s].signature);
      for (let i of this.#e.values()) if (s === i.selector) return i;
      return null;
    }
    if (e.indexOf("(") === -1) {
      let s = [];
      for (let [i, a] of this.#e) i.split("(")[0] === e && s.push(a);
      if (s.length === 0) return e === "Error" ? ze.from("error Error(string)") : e === "Panic" ? ze.from("error Panic(uint256)") : null;
      if (s.length > 1) {
        let i = s.map((a) => JSON.stringify(a.format())).join(", ");
        u(false, `ambiguous error description (i.e. ${i})`, "name", e);
      }
      return s[0];
    }
    if (e = ze.from(e).format(), e === "Error(string)") return ze.from("error Error(string)");
    if (e === "Panic(uint256)") return ze.from("error Panic(uint256)");
    let r = this.#e.get(e);
    return r || null;
  }
  forEachError(e) {
    let t = Array.from(this.#e.keys());
    t.sort((r, s) => r.localeCompare(s));
    for (let r = 0; r < t.length; r++) {
      let s = t[r];
      e(this.#e.get(s), r);
    }
  }
  _decodeParams(e, t) {
    return this.#r.decode(e, t);
  }
  _encodeParams(e, t) {
    return this.#r.encode(e, t);
  }
  encodeDeploy(e) {
    return this._encodeParams(this.deploy.inputs, e || []);
  }
  decodeErrorResult(e, t) {
    if (typeof e == "string") {
      let r = this.getError(e);
      u(r, "unknown error", "fragment", e), e = r;
    }
    return u(De(t, 0, 4) === e.selector, `data signature does not match error ${e.name}.`, "data", t), this._decodeParams(e.inputs, De(t, 4));
  }
  encodeErrorResult(e, t) {
    if (typeof e == "string") {
      let r = this.getError(e);
      u(r, "unknown error", "fragment", e), e = r;
    }
    return _([e.selector, this._encodeParams(e.inputs, t || [])]);
  }
  decodeFunctionData(e, t) {
    if (typeof e == "string") {
      let r = this.getFunction(e);
      u(r, "unknown function", "fragment", e), e = r;
    }
    return u(De(t, 0, 4) === e.selector, `data signature does not match function ${e.name}.`, "data", t), this._decodeParams(e.inputs, De(t, 4));
  }
  encodeFunctionData(e, t) {
    if (typeof e == "string") {
      let r = this.getFunction(e);
      u(r, "unknown function", "fragment", e), e = r;
    }
    return _([e.selector, this._encodeParams(e.inputs, t || [])]);
  }
  decodeFunctionResult(e, t) {
    if (typeof e == "string") {
      let i = this.getFunction(e);
      u(i, "unknown function", "fragment", e), e = i;
    }
    let r = "invalid length for result data", s = re(t);
    if (s.length % 32 === 0) try {
      return this.#r.decode(e.outputs, s);
    } catch {
      r = "could not decode result data";
    }
    k(false, r, "BAD_DATA", { value: g(s), info: { method: e.name, signature: e.format() } });
  }
  makeError(e, t) {
    let r = v(e, "data"), s = Yn.getBuiltinCallException("call", t, r);
    if (s.message.startsWith("execution reverted (unknown custom error)")) {
      let o = g(r.slice(0, 4)), c = this.getError(o);
      if (c) try {
        let f = this.#r.decode(c.inputs, r.slice(4));
        s.revert = { name: c.name, signature: c.format(), args: f }, s.reason = s.revert.signature, s.message = `execution reverted: ${s.reason}`;
      } catch {
        s.message = "execution reverted (coult not decode custom error)";
      }
    }
    let a = this.parseTransaction(t);
    return a && (s.invocation = { method: a.name, signature: a.signature, args: a.args }), s;
  }
  encodeFunctionResult(e, t) {
    if (typeof e == "string") {
      let r = this.getFunction(e);
      u(r, "unknown function", "fragment", e), e = r;
    }
    return g(this.#r.encode(e.outputs, t || []));
  }
  encodeFilterTopics(e, t) {
    if (typeof e == "string") {
      let i = this.getEvent(e);
      u(i, "unknown event", "eventFragment", e), e = i;
    }
    k(t.length <= e.inputs.length, `too many arguments for ${e.format()}`, "UNEXPECTED_ARGUMENT", { count: t.length, expectedCount: e.inputs.length });
    let r = [];
    e.anonymous || r.push(e.topicHash);
    let s = (i, a) => i.type === "string" ? Te(a) : i.type === "bytes" ? z(g(a)) : (i.type === "bool" && typeof a == "boolean" ? a = a ? "0x01" : "0x00" : i.type.match(/^u?int/) ? a = Ne(a) : i.type.match(/^bytes/) ? a = Gr(a, 32) : i.type === "address" && this.#r.encode(["address"], [a]), Pe(g(a), 32));
    for (t.forEach((i, a) => {
      let o = e.inputs[a];
      if (!o.indexed) {
        u(i == null, "cannot filter non-indexed parameters; must be null", "contract." + o.name, i);
        return;
      }
      i == null ? r.push(null) : o.baseType === "array" || o.baseType === "tuple" ? u(false, "filtering with tuples or arrays not supported", "contract." + o.name, i) : Array.isArray(i) ? r.push(i.map((c) => s(o, c))) : r.push(s(o, i));
    }); r.length && r[r.length - 1] === null; ) r.pop();
    return r;
  }
  encodeEventLog(e, t) {
    if (typeof e == "string") {
      let a = this.getEvent(e);
      u(a, "unknown event", "eventFragment", e), e = a;
    }
    let r = [], s = [], i = [];
    return e.anonymous || r.push(e.topicHash), u(t.length === e.inputs.length, "event arguments/values mismatch", "values", t), e.inputs.forEach((a, o) => {
      let c = t[o];
      if (a.indexed) if (a.type === "string") r.push(Te(c));
      else if (a.type === "bytes") r.push(z(c));
      else {
        if (a.baseType === "tuple" || a.baseType === "array") throw new Error("not implemented");
        r.push(this.#r.encode([a.type], [c]));
      }
      else s.push(a), i.push(c);
    }), { data: this.#r.encode(s, i), topics: r };
  }
  decodeEventLog(e, t, r) {
    if (typeof e == "string") {
      let p = this.getEvent(e);
      u(p, "unknown event", "eventFragment", e), e = p;
    }
    if (r != null && !e.anonymous) {
      let p = e.topicHash;
      u(fe(r[0], 32) && r[0].toLowerCase() === p, "fragment/topic mismatch", "topics[0]", r[0]), r = r.slice(1);
    }
    let s = [], i = [], a = [];
    e.inputs.forEach((p, b) => {
      p.indexed ? p.type === "string" || p.type === "bytes" || p.baseType === "tuple" || p.baseType === "array" ? (s.push(xe.from({ type: "bytes32", name: p.name })), a.push(true)) : (s.push(p), a.push(false)) : (i.push(p), a.push(false));
    });
    let o = r != null ? this.#r.decode(s, _(r)) : null, c = this.#r.decode(i, t, true), f = [], d = [], l = 0, x = 0;
    return e.inputs.forEach((p, b) => {
      let h = null;
      if (p.indexed) if (o == null) h = new Xn(null);
      else if (a[b]) h = new Xn(o[x++]);
      else try {
        h = o[x++];
      } catch (m) {
        h = m;
      }
      else try {
        h = c[l++];
      } catch (m) {
        h = m;
      }
      f.push(h), d.push(p.name || null);
    }), dt.fromItems(f, d);
  }
  parseTransaction(e) {
    let t = v(e.data, "tx.data"), r = D(e.value != null ? e.value : 0, "tx.value"), s = this.getFunction(g(t.slice(0, 4)));
    if (!s) return null;
    let i = this.#r.decode(s.inputs, t.slice(4));
    return new Er(s, s.selector, i, r);
  }
  parseCallResult(e) {
    throw new Error("@TODO");
  }
  parseLog(e) {
    let t = this.getEvent(e.topics[0]);
    return !t || t.anonymous ? null : new vr(t, t.topicHash, this.decodeEventLog(t, e.data, e.topics));
  }
  parseError(e) {
    let t = g(e), r = this.getError(De(t, 0, 4));
    if (!r) return null;
    let s = this.#r.decode(r.inputs, De(t, 4));
    return new Ar(r, r.selector, s);
  }
  static from(e) {
    return e instanceof n20 ? e : typeof e == "string" ? new n20(JSON.parse(e)) : typeof e.formatJson == "function" ? new n20(e.formatJson()) : typeof e.format == "function" ? new n20(e.format("json")) : new n20(e);
  }
};
var Kb = BigInt(0);
function Ir(n31) {
  let e = {};
  n31.to && (e.to = n31.to), n31.from && (e.from = n31.from), n31.data && (e.data = g(n31.data));
  let t = "chainId,gasLimit,gasPrice,maxFeePerBlobGas,maxFeePerGas,maxPriorityFeePerGas,value".split(/,/);
  for (let s of t) !(s in n31) || n31[s] == null || (e[s] = D(n31[s], `request.${s}`));
  let r = "type,nonce".split(/,/);
  for (let s of r) !(s in n31) || n31[s] == null || (e[s] = K(n31[s], `request.${s}`));
  return n31.accessList && (e.accessList = Yt(n31.accessList)), n31.authorizationList && (e.authorizationList = n31.authorizationList.slice()), "blockTag" in n31 && (e.blockTag = n31.blockTag), "enableCcipRead" in n31 && (e.enableCcipRead = !!n31.enableCcipRead), "customData" in n31 && (e.customData = n31.customData), "blobVersionedHashes" in n31 && n31.blobVersionedHashes && (e.blobVersionedHashes = n31.blobVersionedHashes.slice()), "kzg" in n31 && (e.kzg = n31.kzg), "blobWrapperVersion" in n31 && (e.blobWrapperVersion = n31.blobWrapperVersion), "blobs" in n31 && n31.blobs && (e.blobs = n31.blobs.map((s) => lt(s) ? g(s) : Object.assign({}, s))), e;
}
function En(n31, e) {
  if (n31.provider) return n31.provider;
  k(false, "missing provider", "UNSUPPORTED_OPERATION", { operation: e });
}
async function k0(n31, e) {
  let t = Ir(e);
  if (t.to != null && (t.to = Zt(t.to, n31)), t.from != null) {
    let r = t.from;
    t.from = Promise.all([n31.getAddress(), Zt(r, n31)]).then(([s, i]) => (u(s.toLowerCase() === i.toLowerCase(), "transaction from mismatch", "tx.from", i), s));
  } else t.from = n31.getAddress();
  return await Ft(t);
}
var Qn = class {
  provider;
  constructor(e) {
    R(this, { provider: e || null });
  }
  async getNonce(e) {
    return En(this, "getTransactionCount").getTransactionCount(await this.getAddress(), e);
  }
  async populateCall(e) {
    return await k0(this, e);
  }
  async populateTransaction(e) {
    let t = En(this, "populateTransaction"), r = await k0(this, e);
    r.nonce == null && (r.nonce = await this.getNonce("pending")), r.gasLimit == null && (r.gasLimit = await this.estimateGas(r));
    let s = await this.provider.getNetwork();
    if (r.chainId != null) {
      let a = D(r.chainId);
      u(a === s.chainId, "transaction chainId mismatch", "tx.chainId", e.chainId);
    } else r.chainId = s.chainId;
    let i = r.maxFeePerGas != null || r.maxPriorityFeePerGas != null;
    if (r.gasPrice != null && (r.type === 2 || i) ? u(false, "eip-1559 transaction do not support gasPrice", "tx", e) : (r.type === 0 || r.type === 1) && i && u(false, "pre-eip-1559 transaction do not support maxFeePerGas/maxPriorityFeePerGas", "tx", e), (r.type === 2 || r.type == null) && r.maxFeePerGas != null && r.maxPriorityFeePerGas != null) r.type = 2;
    else if (r.type === 0 || r.type === 1) {
      let a = await t.getFeeData();
      k(a.gasPrice != null, "network does not support gasPrice", "UNSUPPORTED_OPERATION", { operation: "getGasPrice" }), r.gasPrice == null && (r.gasPrice = a.gasPrice);
    } else {
      let a = await t.getFeeData();
      if (r.type == null) if (a.maxFeePerGas != null && a.maxPriorityFeePerGas != null) if (r.authorizationList && r.authorizationList.length ? r.type = 4 : r.type = 2, r.gasPrice != null) {
        let o = r.gasPrice;
        delete r.gasPrice, r.maxFeePerGas = o, r.maxPriorityFeePerGas = o;
      } else r.maxFeePerGas == null && (r.maxFeePerGas = a.maxFeePerGas), r.maxPriorityFeePerGas == null && (r.maxPriorityFeePerGas = a.maxPriorityFeePerGas);
      else a.gasPrice != null ? (k(!i, "network does not support EIP-1559", "UNSUPPORTED_OPERATION", { operation: "populateTransaction" }), r.gasPrice == null && (r.gasPrice = a.gasPrice), r.type = 0) : k(false, "failed to get consistent fee data", "UNSUPPORTED_OPERATION", { operation: "signer.getFeeData" });
      else (r.type === 2 || r.type === 3 || r.type === 4) && (r.maxFeePerGas == null && (r.maxFeePerGas = a.maxFeePerGas), r.maxPriorityFeePerGas == null && (r.maxPriorityFeePerGas = a.maxPriorityFeePerGas));
    }
    return await Ft(r);
  }
  async populateAuthorization(e) {
    let t = Object.assign({}, e);
    return t.chainId == null && (t.chainId = (await En(this, "getNetwork").getNetwork()).chainId), t.nonce == null && (t.nonce = await this.getNonce()), t;
  }
  async estimateGas(e) {
    return En(this, "estimateGas").estimateGas(await this.populateCall(e));
  }
  async call(e) {
    return En(this, "call").call(await this.populateCall(e));
  }
  async resolveName(e) {
    return await En(this, "resolveName").resolveName(e);
  }
  async sendTransaction(e) {
    let t = En(this, "sendTransaction"), r = await this.populateTransaction(e);
    delete r.from;
    let s = xt.from(r);
    return await t.broadcastTransaction(await this.signTransaction(s));
  }
  authorize(e) {
    k(false, "authorization not implemented for this signer", "UNSUPPORTED_OPERATION", { operation: "authorize" });
  }
}, kr = class n21 extends Qn {
  address;
  constructor(e, t) {
    super(t), R(this, { address: e });
  }
  async getAddress() {
    return this.address;
  }
  connect(e) {
    return new n21(this.address, e);
  }
  #e(e, t) {
    k(false, `VoidSigner cannot sign ${e}`, "UNSUPPORTED_OPERATION", { operation: t });
  }
  async signTransaction(e) {
    this.#e("transactions", "signTransaction");
  }
  async signMessage(e) {
    this.#e("messages", "signMessage");
  }
  async signTypedData(e, t, r) {
    this.#e("typed-data", "signTypedData");
  }
};
var An = class n22 extends Qn {
  address;
  #e;
  constructor(e, t) {
    super(t), u(e && typeof e.sign == "function", "invalid private key", "privateKey", "[ REDACTED ]"), this.#e = e;
    let r = ut(this.signingKey.publicKey);
    R(this, { address: r });
  }
  get signingKey() {
    return this.#e;
  }
  get privateKey() {
    return this.signingKey.privateKey;
  }
  async getAddress() {
    return this.address;
  }
  connect(e) {
    return new n22(this.#e, e);
  }
  async signTransaction(e) {
    e = Ir(e);
    let { to: t, from: r } = await Ft({ to: e.to ? Zt(e.to, this) : void 0, from: e.from ? Zt(e.from, this) : void 0 });
    t != null && (e.to = t), r != null && (e.from = r), e.from != null && (u(q(e.from) === this.address, "transaction from address mismatch", "tx.from", e.from), delete e.from);
    let s = xt.from(e);
    return s.signature = this.signingKey.sign(s.unsignedHash), s.serialized;
  }
  async signMessage(e) {
    return this.signMessageSync(e);
  }
  signMessageSync(e) {
    return this.signingKey.sign(Di(e)).serialized;
  }
  authorizeSync(e) {
    u(typeof e.address == "string", "invalid address for authorizeSync", "auth.address", e);
    let t = this.signingKey.sign(Ui(e));
    return Object.assign({}, { address: q(e.address), nonce: D(e.nonce || 0), chainId: D(e.chainId || 0) }, { signature: t });
  }
  async authorize(e) {
    return e = Object.assign({}, e, { address: await Zt(e.address, this) }), this.authorizeSync(await this.populateAuthorization(e));
  }
  async signTypedData(e, t, r) {
    let s = await jn.resolveNames(e, t, r, async (i) => {
      k(this.provider != null, "cannot resolve ENS names without a provider", "UNSUPPORTED_OPERATION", { operation: "resolveName", info: { name: i } });
      let a = await this.provider.resolveName(i);
      return k(a != null, "unconfigured ENS name", "UNCONFIGURED_NAME", { value: i }), a;
    });
    return this.signingKey.sign(jn.hash(s.domain, t, s.value)).serialized;
  }
};
var Ns = " !#$%&'()*+,-./<=>?@[]^_`{|}~", Hl = /^[a-z]*$/i;
function S0(n31, e) {
  let t = 97;
  return n31.reduce((r, s) => (s === e ? t++ : s.match(Hl) ? r.push(String.fromCharCode(t) + s) : (t = 97, r.push(s)), r), []);
}
function Vl(n31, e) {
  for (let s = Ns.length - 1; s >= 0; s--) n31 = n31.split(Ns[s]).join(e.substring(2 * s, 2 * s + 2));
  let t = [], r = n31.replace(/(:|([0-9])|([A-Z][a-z]*))/g, (s, i, a, o) => {
    if (a) for (let c = parseInt(a); c >= 0; c--) t.push(";");
    else t.push(i.toLowerCase());
    return "";
  });
  if (r) throw new Error(`leftovers: ${JSON.stringify(r)}`);
  return S0(S0(t, ";"), ":");
}
function B0(n31) {
  return u(n31[0] === "0", "unsupported auwl data", "data", n31), Vl(n31.substring(1 + 2 * Ns.length), n31.substring(1, 1 + 2 * Ns.length));
}
var Ts = class {
  locale;
  constructor(e) {
    R(this, { locale: e });
  }
  split(e) {
    return e.toLowerCase().split(/\s+/g);
  }
  join(e) {
    return e.join(" ");
  }
};
var Rs = class extends Ts {
  #e;
  #t;
  constructor(e, t, r) {
    super(e), this.#e = t, this.#t = r, this.#n = null;
  }
  get _data() {
    return this.#e;
  }
  _decodeWords() {
    return B0(this.#e);
  }
  #n;
  #r() {
    if (this.#n == null) {
      let e = this._decodeWords();
      if (Te(e.join(`
`) + `
`) !== this.#t) throw new Error(`BIP39 Wordlist for ${this.locale} FAILED`);
      this.#n = e;
    }
    return this.#n;
  }
  getWord(e) {
    let t = this.#r();
    return u(e >= 0 && e < t.length, `invalid word index: ${e}`, "index", e), t[e];
  }
  getWordIndex(e) {
    return this.#r().indexOf(e);
  }
};
var Kl = "0erleonalorenseinceregesticitStanvetearctssi#ch2Athck&tneLl0And#Il.yLeOutO=S|S%b/ra@SurdU'0Ce[Cid|CountCu'Hie=IdOu,-Qui*Ro[TT]T%T*[Tu$0AptDD-tD*[Ju,M.UltV<)Vi)0Rob-0FairF%dRaid0A(EEntRee0Ead0MRRp%tS!_rmBumCoholErtI&LLeyLowMo,O}PhaReadySoT Ways0A>urAz(gOngOuntU'd0Aly,Ch%Ci|G G!GryIm$K!Noun)Nu$O` Sw T&naTiqueXietyY1ArtOlogyPe?P!Pro=Ril1ChCt-EaEnaGueMMedM%MyOundR<+Re,Ri=RowTTefa@Ti,Tw%k0KPe@SaultSetSi,SumeThma0H!>OmTa{T&dT.udeTra@0Ct]D.Gu,NtTh%ToTumn0Era+OcadoOid0AkeA*AyEsomeFulKw?d0Is:ByChel%C#D+GL<)Lc#y~MbooN<aNn RRelyRga(R*lSeS-SketTt!3A^AnAutyCau'ComeEfF%eG(Ha=H(dLie=LowLtN^Nef./TrayTt Twe&Y#d3Cyc!DKeNdOlogyRdR`Tt _{AdeAmeAnketA,EakE[IndOodO[omOu'UeUrUsh_rdAtDyIlMbNeNusOkO,Rd R(gRrowSsTtomUn)XY_{etA(AndA[A=EadEezeI{Id+IefIghtIngIskOccoliOk&OnzeOomO` OwnUsh2Bb!DdyD+tFf$oIldLbLkL!tNd!Nk Rd&Rg R,SS(e[SyTt Y Zz:Bba+B(B!CtusGeKe~LmM aMpNN$N)lNdyNn#NoeNvasNy#Pab!P.$Pta(RRb#RdRgoRpetRryRtSeShS(o/!Su$TT$ogT^Teg%yTt!UghtU'Ut]Ve3Il(gL yM|NsusNturyRe$Rta(_irAlkAmp]An+AosApt Ar+A'AtEapE{Ee'EfErryE,I{&IefIldIm}yOi)Oo'R#-U{!UnkUrn0G?Nnam#Rc!Tiz&TyVil_imApArifyAwAyE<ErkEv I{I|IffImbIn-IpO{OgO'O`OudOwnUbUmpU, Ut^_^A,C#utDeFfeeIlInL!@L%LumnMb(eMeMf%tM-Mm#Mp<yNc tNdu@NfirmNg*[N}@Nsid NtrolNv()OkOlPp PyR$ReRnR*@/Tt#U^UntryUp!Ur'Us(V Yo>_{Ad!AftAmA}AshAt AwlAzyEamEd.EekEwI{etImeIspIt-OpO[Ou^OwdUci$UelUi'Umb!Un^UshYY,$2BeLtu*PPbo?dRiousRr|Rta(R=Sh]/omTe3C!:DMa+MpN)Ng R(gShUght WnY3AlBa>BrisCadeCemb CideCl(eC%a>C*a'ErF&'F(eFyG*eLayLiv M<dMi'Ni$Nti,NyP?tP&dPos.P`PutyRi=ScribeS tSignSkSpair/royTailTe@VelopVi)Vo>3AgramAlAm#dAryCeE'lEtFf G.$Gn.yLemmaNn NosaurRe@RtSag*eScov Sea'ShSmi[S%d Splay/<)V tVideV%)Zzy5Ct%Cum|G~Lph(Ma(Na>NkeyN%OrSeUb!Ve_ftAg#AmaA,-AwEamE[IftIllInkIpI=OpUmY2CkMbNeR(g/T^Ty1Arf1Nam-:G G!RlyRnR`Sily/Sy1HoOlogyOnomy0GeItUca>1F%t0G1GhtTh 2BowD E@r-Eg<tEm|Eph<tEvat%I>Se0B?kBodyBra)Er+Ot]PloyPow Pty0Ab!A@DD![D%'EmyErgyF%)Ga+G(eH<)JoyLi,OughR-hRollSu*T Ti*TryVelope1Isode0U$Uip0AA'OdeOs]R%Upt0CapeSayS&)Ta>0Ern$H-s1Id&)IlOkeOl=1A@Amp!Ce[Ch<+C.eCludeCu'Ecu>Erci'Hau,Hib.I!I,ItOt-P<dPe@Pi*Pla(Po'P*[T&dTra0EEbrow:Br-CeCultyDeIntI`~L'MeMilyMousNNcyNtasyRmSh]TT$Th TigueUltV%.e3Atu*Bru?yD $EEdElMa!N)/iv$T^V W3B Ct]EldGu*LeLmLt N$NdNeNg NishReRmR,Sc$ShTT}[X_gAmeAshAtAv%EeIghtIpOatO{O%Ow UidUshY_mCusGIlLd~owOdOtR)Re,R+tRkRtu}RumRw?dSsil/ UndX_gi!AmeEqu|EshI&dIn+OgOntO,OwnOz&U.2ElNNnyRna)RyTu*:D+tInLaxy~ yMePRa+Rba+Rd&Rl-Rm|SSpTeTh U+Ze3N $NiusN*Nt!Nu(e/u*2O,0AntFtGg!Ng RaffeRlVe_dAn)A*A[IdeImp'ObeOomOryO=OwUe_tDde[LdOdO'RillaSpelSsipV nWn_bA)A(AntApeA[Av.yEatE&IdIefItOc yOupOwUnt_rdE[IdeIltIt?N3M:B.IrLfMm M, NdPpyRb%RdRshR=,TVeWkZ?d3AdAl`ArtAvyD+hogIght~oLmetLpNRo3Dd&Gh~NtPRe/%y5BbyCkeyLdLeLiday~owMeNeyOdPeRnRr%R'Sp.$/TelUrV 5BGeM<Mb!M%Nd*dNgryNtRd!RryRtSb<d3Brid:1EOn0EaEntifyLe2N%e4LLeg$L}[0A+Ita>M&'Mu}Pa@Po'Pro=Pul'0ChCludeComeC*a'DexD-a>Do%Du,ryF<tFl-tF%mHa!H .Iti$Je@JuryMa>N Noc|PutQuiryS<eSe@SideSpi*/$lTa@T e,ToVe,V.eVol=3On0L<dOla>Sue0Em1Ory:CketGu?RZz3AlousAns~yWel9BInKeUr}yY5D+I)MpNg!Ni%Nk/:Ng?oo3EnEpT^upY3CkDD}yNdNgdomSsTT^&TeTt&Wi4EeIfeO{Ow:BBelB%Dd DyKeMpNgua+PtopR+T T(UghUndryVaWWnWsu.Y Zy3Ad AfArnA=Ctu*FtGG$G&dIsu*M#NdNg`NsOp?dSs#Tt Vel3ArB tyBr?yC&'FeFtGhtKeMbM.NkOnQuid/Tt!VeZ?d5AdAnB, C$CkG-NelyNgOpTt yUdUn+VeY$5CkyGga+Mb N?N^Xury3R-s:Ch(eDG-G}tIdIlInJ%KeMm$NNa+Nda>NgoNs]Nu$P!Rb!R^Rg(R(eRketRria+SkSs/ T^T i$ThTrixTt XimumZe3AdowAnAsu*AtCh<-D$DiaLodyLtMb M%yNt]NuRcyR+R.RryShSsa+T$Thod3Dd!DnightLk~]M-NdNimumN%Nu>Rac!Rr%S ySs/akeXXedXtu*5Bi!DelDifyMM|N.%NkeyN, N`OnR$ReRn(gSqu.oTh T]T%Unta(U'VeVie5ChFf(LeLtiplySc!SeumShroomS-/Tu$3Self/ yTh:I=MePk(Rrow/yT]Tu*3ArCkEdGati=G!@I` PhewR=/TTw%kUtr$V WsXt3CeGht5B!I'M(eeOd!Rm$R`SeTab!TeTh(gTi)VelW5C!?Mb R'T:K0EyJe@Li+Scu*S =Ta(Vious0CurE<Tob 0Or1FF Fi)T&2L1Ay0DI=Ymp-0It0CeEI#L(eLy1EnEraIn]Po'T]1An+B.Ch?dD D(?yG<I|Ig($Ph<0Tr-h0H 0Tdo%T TputTside0AlEnEr0NN 0Yg&0/ 0O}:CtDd!GeIrLa)LmNdaNelN-N` P RadeR|RkRrotRtySsT^ThTi|TrolTt nU'VeYm|3A)AnutArAs<tL-<NN$tyNcilOp!Pp Rfe@Rm.Rs#T2O}OtoRa'Ys-$0AnoCn-Ctu*E)GGe#~LotNkO} Pe/olT^Zza_)A}tA,-A>AyEa'Ed+U{UgUn+2EmEtIntL?LeLi)NdNyOlPul?Rt]S.]Ssib!/TatoTt yV tyWd W _@i)Ai'Ed-tEf Epa*Es|EttyEv|I)IdeIm?yIntI%.yIs#Iva>IzeOb!mO)[Odu)Of.OgramOje@Omo>OofOp tyOsp O>@OudOvide2Bl-Dd(g~LpL'Mpk(N^PilPpyR^a'R.yRpo'R'ShTZz!3Ramid:99Al.yAntumArt E,]I{ItIzO>:Bb.Cco#CeCkD?DioIlInI'~yMpN^NdomN+PidReTeTh V&WZ%3AdyAlAs#BelBuildC$lCei=CipeC%dCyc!Du)F!@F%mFu'G]G*tGul?Je@LaxLea'LiefLyMa(Memb M(dMo=Nd NewNtOp&PairPeatPla)P%tQui*ScueSemb!Si,Sour)Sp#'SultTi*T*atTurnUn]Ve$ViewW?d2Y`m0BBb#CeChDeD+F!GhtGidNgOtPp!SkTu$V$V 5AdA,BotBu,CketM<)OfOkieOmSeTa>UghUndU>Y$5Bb DeGLeNNwayR$:DDd!D}[FeIlLadLm#L#LtLu>MeMp!NdTisfyToshiU)Usa+VeY1A!AnA*Att E}HemeHoolI&)I[%sOrp]OutRapRe&RiptRub1AAr^As#AtC#dC*tCt]Cur.yEdEkGm|Le@~M(?Ni%N'Nt&)RiesRvi)Ss]Tt!TupV&_dowAftAllowA*EdEllEriffIeldIftI}IpIv O{OeOotOpOrtOuld O=RimpRugUff!Y0Bl(gCkDeE+GhtGnL|Lk~yLv Mil?Mp!N)NgR&/ Tua>XZe1A>Et^IIllInIrtUll0AbAmEepEnd I)IdeIghtImOg<OtOwUsh0AllArtI!OkeOo`0A{AkeApIffOw0ApCc Ci$CkDaFtL?Ldi LidLut]L=Me#eNgOnRryRtUlUndUpUr)U`0A)A*Ati$AwnEakEci$EedEllEndH eI)Id IkeInIr.L.OilOns%O#OrtOtRayReadR(gY0Ua*UeezeUir*l_b!AdiumAffA+AirsAmpAndArtA>AyEakEelEmEpE*oI{IllIngO{Oma^O}OolOryO=Ra>gyReetRikeR#gRugg!Ud|UffUmb!Y!0Bje@Bm.BwayC)[ChDd&Ff G?G+,ItMm NNnyN'tP PplyP*meReRfa)R+Rpri'RroundR=ySpe@/a(1AllowAmpApArmE?EetIftImIngIt^Ord1MbolMptomRup/em:B!Ck!GIlL|LkNkPeR+tSk/eTtooXi3A^Am~NN<tNnisNtRm/Xt_nkAtEmeEnE%yE*EyIngIsOughtReeRi=RowUmbUnd 0CketDeG LtMb MeNyPRedSsueT!5A,BaccoDayDdl EGe` I!tK&MatoM%rowNeNgueNightOlO`PP-Pp!R^RnadoRtoi'SsT$Uri,W?dW WnY_{AdeAff-Ag-A(Ansf ApAshA=lAyEatEeEndI$IbeI{Igg ImIpOphyOub!U{UeUlyUmpetU,U`Y2BeIt]Mb!NaN}lRkeyRnRt!1El=EntyI)InI,O1PeP-$:5Ly5B*lla0Ab!Awa*C!Cov D DoFairFoldHappyIf%mIqueItIv 'KnownLo{TilUsu$Veil1Da>GradeHoldOnP Set1B<Ge0A+EEdEfulE![U$0Il.y:C<tCuumGueLidL!yL=NNishP%Rious/Ult3H-!L=tNd%Ntu*NueRbRifyRs]RyS'lT <3Ab!Br<tCiousCt%yDeoEw~a+Nta+Ol(Rtu$RusSaS.Su$T$Vid5C$I)IdLc<oLumeTeYa+:GeG#ItLk~LnutNtRfa*RmRri%ShSp/eT VeY3Al`Ap#ArA'lA` BDd(gEk&dIrdLcome/T_!AtEatEelEnE*IpIsp 0DeD`FeLd~NNdowNeNgNkNn Nt ReSdomSeShT}[5LfM<Nd OdOlRdRkRldRryR`_pE{E,!I,I>Ong::Rd3Ar~ow9UUngU`:3BraRo9NeO", Wl = "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60", $i = null, Tt = class n23 extends Rs {
  constructor() {
    super("en", Kl, Wl);
  }
  static wordlist() {
    return $i == null && ($i = new n23()), $i;
  }
};
function P0(n31) {
  return (1 << n31) - 1 << 8 - n31 & 255;
}
function Jl(n31) {
  return (1 << n31) - 1 & 255;
}
function Mi(n31, e) {
  Dn("NFKD"), e == null && (e = Tt.wordlist());
  let t = e.split(n31);
  u(t.length % 3 === 0 && t.length >= 12 && t.length <= 24, "invalid mnemonic length", "mnemonic", "[ REDACTED ]");
  let r = new Uint8Array(Math.ceil(11 * t.length / 8)), s = 0;
  for (let f = 0; f < t.length; f++) {
    let d = e.getWordIndex(t[f].normalize("NFKD"));
    u(d >= 0, `invalid mnemonic word at index ${f}`, "mnemonic", "[ REDACTED ]");
    for (let l = 0; l < 11; l++) d & 1 << 10 - l && (r[s >> 3] |= 1 << 7 - s % 8), s++;
  }
  let i = 32 * t.length / 3, a = t.length / 3, o = P0(a), c = v(ue(r.slice(0, i / 8)))[0] & o;
  return u(c === (r[r.length - 1] & o), "invalid mnemonic checksum", "mnemonic", "[ REDACTED ]"), g(r.slice(0, i / 8));
}
function zi(n31, e) {
  u(n31.length % 4 === 0 && n31.length >= 16 && n31.length <= 32, "invalid entropy size", "entropy", "[ REDACTED ]"), e == null && (e = Tt.wordlist());
  let t = [0], r = 11;
  for (let a = 0; a < n31.length; a++) r > 8 ? (t[t.length - 1] <<= 8, t[t.length - 1] |= n31[a], r -= 8) : (t[t.length - 1] <<= r, t[t.length - 1] |= n31[a] >> 8 - r, t.push(n31[a] & Jl(8 - r)), r += 3);
  let s = n31.length / 4, i = parseInt(ue(n31).substring(2, 4), 16) & P0(s);
  return t[t.length - 1] <<= s, t[t.length - 1] |= i >> 8 - s, e.join(t.map((a) => e.getWord(a)));
}
var Hi = {}, rn = class n24 {
  phrase;
  password;
  wordlist;
  entropy;
  constructor(e, t, r, s, i) {
    s == null && (s = ""), i == null && (i = Tt.wordlist()), Ae(e, Hi, "Mnemonic"), R(this, { phrase: r, password: s, wordlist: i, entropy: t });
  }
  computeSeed() {
    let e = me("mnemonic" + this.password, "NFKD");
    return Ge(me(this.phrase, "NFKD"), e, 2048, 64, "sha512");
  }
  static fromPhrase(e, t, r) {
    let s = Mi(e, r);
    return e = zi(v(s), r), new n24(Hi, s, e, t, r);
  }
  static fromEntropy(e, t, r) {
    let s = v(e, "entropy"), i = zi(s, r);
    return new n24(Hi, g(s), i, t, r);
  }
  static entropyToPhrase(e, t) {
    let r = v(e, "entropy");
    return zi(r, t);
  }
  static phraseToEntropy(e, t) {
    return Mi(e, t);
  }
  static isValidMnemonic(e, t) {
    try {
      return Mi(e, t), true;
    } catch {
    }
    return false;
  }
};
var ve = function(n31, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n31 !== e || !r : !e.has(n31)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(n31) : r ? r.value : e.get(n31);
}, Vi = function(n31, e, t, r, s) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !s) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n31 !== e || !s : !e.has(n31)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? s.call(n31, t) : s ? s.value = t : e.set(n31, t), t;
}, Cs, je, ht, ql = { 16: 10, 24: 12, 32: 14 }, jl = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145], qe = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22], Os = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125], Zl = [3328402341, 4168907908, 4000806809, 4135287693, 4294111757, 3597364157, 3731845041, 2445657428, 1613770832, 33620227, 3462883241, 1445669757, 3892248089, 3050821474, 1303096294, 3967186586, 2412431941, 528646813, 2311702848, 4202528135, 4026202645, 2992200171, 2387036105, 4226871307, 1101901292, 3017069671, 1604494077, 1169141738, 597466303, 1403299063, 3832705686, 2613100635, 1974974402, 3791519004, 1033081774, 1277568618, 1815492186, 2118074177, 4126668546, 2211236943, 1748251740, 1369810420, 3521504564, 4193382664, 3799085459, 2883115123, 1647391059, 706024767, 134480908, 2512897874, 1176707941, 2646852446, 806885416, 932615841, 168101135, 798661301, 235341577, 605164086, 461406363, 3756188221, 3454790438, 1311188841, 2142417613, 3933566367, 302582043, 495158174, 1479289972, 874125870, 907746093, 3698224818, 3025820398, 1537253627, 2756858614, 1983593293, 3084310113, 2108928974, 1378429307, 3722699582, 1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436, 1075847264, 3825007647, 2041688520, 3059440621, 3563743934, 2378943302, 1740553945, 1916352843, 2487896798, 2555137236, 2958579944, 2244988746, 3151024235, 3320835882, 1336584933, 3992714006, 2252555205, 2588757463, 1714631509, 293963156, 2319795663, 3925473552, 67240454, 4269768577, 2689618160, 2017213508, 631218106, 1269344483, 2723238387, 1571005438, 2151694528, 93294474, 1066570413, 563977660, 1882732616, 4059428100, 1673313503, 2008463041, 2950355573, 1109467491, 537923632, 3858759450, 4260623118, 3218264685, 2177748300, 403442708, 638784309, 3287084079, 3193921505, 899127202, 2286175436, 773265209, 2479146071, 1437050866, 4236148354, 2050833735, 3362022572, 3126681063, 840505643, 3866325909, 3227541664, 427917720, 2655997905, 2749160575, 1143087718, 1412049534, 999329963, 193497219, 2353415882, 3354324521, 1807268051, 672404540, 2816401017, 3160301282, 369822493, 2916866934, 3688947771, 1681011286, 1949973070, 336202270, 2454276571, 201721354, 1210328172, 3093060836, 2680341085, 3184776046, 1135389935, 3294782118, 965841320, 831886756, 3554993207, 4068047243, 3588745010, 2345191491, 1849112409, 3664604599, 26054028, 2983581028, 2622377682, 1235855840, 3630984372, 2891339514, 4092916743, 3488279077, 3395642799, 4101667470, 1202630377, 268961816, 1874508501, 4034427016, 1243948399, 1546530418, 941366308, 1470539505, 1941222599, 2546386513, 3421038627, 2715671932, 3899946140, 1042226977, 2521517021, 1639824860, 227249030, 260737669, 3765465232, 2084453954, 1907733956, 3429263018, 2420656344, 100860677, 4160157185, 470683154, 3261161891, 1781871967, 2924959737, 1773779408, 394692241, 2579611992, 974986535, 664706745, 3655459128, 3958962195, 731420851, 571543859, 3530123707, 2849626480, 126783113, 865375399, 765172662, 1008606754, 361203602, 3387549984, 2278477385, 2857719295, 1344809080, 2782912378, 59542671, 1503764984, 160008576, 437062935, 1707065306, 3622233649, 2218934982, 3496503480, 2185314755, 697932208, 1512910199, 504303377, 2075177163, 2824099068, 1841019862, 739644986], Yl = [2781242211, 2230877308, 2582542199, 2381740923, 234877682, 3184946027, 2984144751, 1418839493, 1348481072, 50462977, 2848876391, 2102799147, 434634494, 1656084439, 3863849899, 2599188086, 1167051466, 2636087938, 1082771913, 2281340285, 368048890, 3954334041, 3381544775, 201060592, 3963727277, 1739838676, 4250903202, 3930435503, 3206782108, 4149453988, 2531553906, 1536934080, 3262494647, 484572669, 2923271059, 1783375398, 1517041206, 1098792767, 49674231, 1334037708, 1550332980, 4098991525, 886171109, 150598129, 2481090929, 1940642008, 1398944049, 1059722517, 201851908, 1385547719, 1699095331, 1587397571, 674240536, 2704774806, 252314885, 3039795866, 151914247, 908333586, 2602270848, 1038082786, 651029483, 1766729511, 3447698098, 2682942837, 454166793, 2652734339, 1951935532, 775166490, 758520603, 3000790638, 4004797018, 4217086112, 4137964114, 1299594043, 1639438038, 3464344499, 2068982057, 1054729187, 1901997871, 2534638724, 4121318227, 1757008337, 0, 750906861, 1614815264, 535035132, 3363418545, 3988151131, 3201591914, 1183697867, 3647454910, 1265776953, 3734260298, 3566750796, 3903871064, 1250283471, 1807470800, 717615087, 3847203498, 384695291, 3313910595, 3617213773, 1432761139, 2484176261, 3481945413, 283769337, 100925954, 2180939647, 4037038160, 1148730428, 3123027871, 3813386408, 4087501137, 4267549603, 3229630528, 2315620239, 2906624658, 3156319645, 1215313976, 82966005, 3747855548, 3245848246, 1974459098, 1665278241, 807407632, 451280895, 251524083, 1841287890, 1283575245, 337120268, 891687699, 801369324, 3787349855, 2721421207, 3431482436, 959321879, 1469301956, 4065699751, 2197585534, 1199193405, 2898814052, 3887750493, 724703513, 2514908019, 2696962144, 2551808385, 3516813135, 2141445340, 1715741218, 2119445034, 2872807568, 2198571144, 3398190662, 700968686, 3547052216, 1009259540, 2041044702, 3803995742, 487983883, 1991105499, 1004265696, 1449407026, 1316239930, 504629770, 3683797321, 168560134, 1816667172, 3837287516, 1570751170, 1857934291, 4014189740, 2797888098, 2822345105, 2754712981, 936633572, 2347923833, 852879335, 1133234376, 1500395319, 3084545389, 2348912013, 1689376213, 3533459022, 3762923945, 3034082412, 4205598294, 133428468, 634383082, 2949277029, 2398386810, 3913789102, 403703816, 3580869306, 2297460856, 1867130149, 1918643758, 607656988, 4049053350, 3346248884, 1368901318, 600565992, 2090982877, 2632479860, 557719327, 3717614411, 3697393085, 2249034635, 2232388234, 2430627952, 1115438654, 3295786421, 2865522278, 3633334344, 84280067, 33027830, 303828494, 2747425121, 1600795957, 4188952407, 3496589753, 2434238086, 1486471617, 658119965, 3106381470, 953803233, 334231800, 3005978776, 857870609, 3151128937, 1890179545, 2298973838, 2805175444, 3056442267, 574365214, 2450884487, 550103529, 1233637070, 4289353045, 2018519080, 2057691103, 2399374476, 4166623649, 2148108681, 387583245, 3664101311, 836232934, 3330556482, 3100665960, 3280093505, 2955516313, 2002398509, 287182607, 3413881008, 4238890068, 3597515707, 975967766], Xl = [1671808611, 2089089148, 2006576759, 2072901243, 4061003762, 1807603307, 1873927791, 3310653893, 810573872, 16974337, 1739181671, 729634347, 4263110654, 3613570519, 2883997099, 1989864566, 3393556426, 2191335298, 3376449993, 2106063485, 4195741690, 1508618841, 1204391495, 4027317232, 2917941677, 3563566036, 2734514082, 2951366063, 2629772188, 2767672228, 1922491506, 3227229120, 3082974647, 4246528509, 2477669779, 644500518, 911895606, 1061256767, 4144166391, 3427763148, 878471220, 2784252325, 3845444069, 4043897329, 1905517169, 3631459288, 827548209, 356461077, 67897348, 3344078279, 593839651, 3277757891, 405286936, 2527147926, 84871685, 2595565466, 118033927, 305538066, 2157648768, 3795705826, 3945188843, 661212711, 2999812018, 1973414517, 152769033, 2208177539, 745822252, 439235610, 455947803, 1857215598, 1525593178, 2700827552, 1391895634, 994932283, 3596728278, 3016654259, 695947817, 3812548067, 795958831, 2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784, 4229948412, 2982705585, 1542305371, 1790891114, 3410398667, 3201918910, 961245753, 1256100938, 1289001036, 1491644504, 3477767631, 3496721360, 4012557807, 2867154858, 4212583931, 1137018435, 1305975373, 861234739, 2241073541, 1171229253, 4178635257, 33948674, 2139225727, 1357946960, 1011120188, 2679776671, 2833468328, 1374921297, 2751356323, 1086357568, 2408187279, 2460827538, 2646352285, 944271416, 4110742005, 3168756668, 3066132406, 3665145818, 560153121, 271589392, 4279952895, 4077846003, 3530407890, 3444343245, 202643468, 322250259, 3962553324, 1608629855, 2543990167, 1154254916, 389623319, 3294073796, 2817676711, 2122513534, 1028094525, 1689045092, 1575467613, 422261273, 1939203699, 1621147744, 2174228865, 1339137615, 3699352540, 577127458, 712922154, 2427141008, 2290289544, 1187679302, 3995715566, 3100863416, 339486740, 3732514782, 1591917662, 186455563, 3681988059, 3762019296, 844522546, 978220090, 169743370, 1239126601, 101321734, 611076132, 1558493276, 3260915650, 3547250131, 2901361580, 1655096418, 2443721105, 2510565781, 3828863972, 2039214713, 3878868455, 3359869896, 928607799, 1840765549, 2374762893, 3580146133, 1322425422, 2850048425, 1823791212, 1459268694, 4094161908, 3928346602, 1706019429, 2056189050, 2934523822, 135794696, 3134549946, 2022240376, 628050469, 779246638, 472135708, 2800834470, 3032970164, 3327236038, 3894660072, 3715932637, 1956440180, 522272287, 1272813131, 3185336765, 2340818315, 2323976074, 1888542832, 1044544574, 3049550261, 1722469478, 1222152264, 50660867, 4127324150, 236067854, 1638122081, 895445557, 1475980887, 3117443513, 2257655686, 3243809217, 489110045, 2662934430, 3778599393, 4162055160, 2561878936, 288563729, 1773916777, 3648039385, 2391345038, 2493985684, 2612407707, 505560094, 2274497927, 3911240169, 3460925390, 1442818645, 678973480, 3749357023, 2358182796, 2717407649, 2306869641, 219617805, 3218761151, 3862026214, 1120306242, 1756942440, 1103331905, 2578459033, 762796589, 252780047, 2966125488, 1425844308, 3151392187, 372911126], Ql = [1667474886, 2088535288, 2004326894, 2071694838, 4075949567, 1802223062, 1869591006, 3318043793, 808472672, 16843522, 1734846926, 724270422, 4278065639, 3621216949, 2880169549, 1987484396, 3402253711, 2189597983, 3385409673, 2105378810, 4210693615, 1499065266, 1195886990, 4042263547, 2913856577, 3570689971, 2728590687, 2947541573, 2627518243, 2762274643, 1920112356, 3233831835, 3082273397, 4261223649, 2475929149, 640051788, 909531756, 1061110142, 4160160501, 3435941763, 875846760, 2779116625, 3857003729, 4059105529, 1903268834, 3638064043, 825316194, 353713962, 67374088, 3351728789, 589522246, 3284360861, 404236336, 2526454071, 84217610, 2593830191, 117901582, 303183396, 2155911963, 3806477791, 3958056653, 656894286, 2998062463, 1970642922, 151591698, 2206440989, 741110872, 437923380, 454765878, 1852748508, 1515908788, 2694904667, 1381168804, 993742198, 3604373943, 3014905469, 690584402, 3823320797, 791638366, 2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704, 4244381667, 2981218425, 1532751286, 1785380564, 3419096717, 3200178535, 960056178, 1246420628, 1280103576, 1482221744, 3486468741, 3503319995, 4025428677, 2863326543, 4227536621, 1128514950, 1296947098, 859002214, 2240123921, 1162203018, 4193849577, 33687044, 2139062782, 1347481760, 1010582648, 2678045221, 2829640523, 1364325282, 2745433693, 1077985408, 2408548869, 2459086143, 2644360225, 943212656, 4126475505, 3166494563, 3065430391, 3671750063, 555836226, 269496352, 4294908645, 4092792573, 3537006015, 3452783745, 202118168, 320025894, 3974901699, 1600119230, 2543297077, 1145359496, 387397934, 3301201811, 2812801621, 2122220284, 1027426170, 1684319432, 1566435258, 421079858, 1936954854, 1616945344, 2172753945, 1330631070, 3705438115, 572679748, 707427924, 2425400123, 2290647819, 1179044492, 4008585671, 3099120491, 336870440, 3739122087, 1583276732, 185277718, 3688593069, 3772791771, 842159716, 976899700, 168435220, 1229577106, 101059084, 606366792, 1549591736, 3267517855, 3553849021, 2897014595, 1650632388, 2442242105, 2509612081, 3840161747, 2038008818, 3890688725, 3368567691, 926374254, 1835907034, 2374863873, 3587531953, 1313788572, 2846482505, 1819063512, 1448540844, 4109633523, 3941213647, 1701162954, 2054852340, 2930698567, 134748176, 3132806511, 2021165296, 623210314, 774795868, 471606328, 2795958615, 3031746419, 3334885783, 3907527627, 3722280097, 1953799400, 522133822, 1263263126, 3183336545, 2341176845, 2324333839, 1886425312, 1044267644, 3048588401, 1718004428, 1212733584, 50529542, 4143317495, 235803164, 1633788866, 892690282, 1465383342, 3115962473, 2256965911, 3250673817, 488449850, 2661202215, 3789633753, 4177007595, 2560144171, 286339874, 1768537042, 3654906025, 2391705863, 2492770099, 2610673197, 505291324, 2273808917, 3924369609, 3469625735, 1431699370, 673740880, 3755965093, 2358021891, 2711746649, 2307489801, 218961690, 3217021541, 3873845719, 1111672452, 1751693520, 1094828930, 2576986153, 757954394, 252645662, 2964376443, 1414855848, 3149649517, 370555436], ed = [1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753, 2902087851, 1273168787, 540080725, 2910219766, 2295101073, 4110568485, 1340463100, 3307916247, 641025152, 3043140495, 3736164937, 632953703, 1172967064, 1576976609, 3274667266, 2169303058, 2370213795, 1809054150, 59727847, 361929877, 3211623147, 2505202138, 3569255213, 1484005843, 1239443753, 2395588676, 1975683434, 4102977912, 2572697195, 666464733, 3202437046, 4035489047, 3374361702, 2110667444, 1675577880, 3843699074, 2538681184, 1649639237, 2976151520, 3144396420, 4269907996, 4178062228, 1883793496, 2403728665, 2497604743, 1383856311, 2876494627, 1917518562, 3810496343, 1716890410, 3001755655, 800440835, 2261089178, 3543599269, 807962610, 599762354, 33778362, 3977675356, 2328828971, 2809771154, 4077384432, 1315562145, 1708848333, 101039829, 3509871135, 3299278474, 875451293, 2733856160, 92987698, 2767645557, 193195065, 1080094634, 1584504582, 3178106961, 1042385657, 2531067453, 3711829422, 1306967366, 2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327, 2302690252, 1742315127, 2968011453, 126454664, 3877198648, 2043211483, 2709260871, 2084704233, 4169408201, 0, 159417987, 841739592, 504459436, 1817866830, 4245618683, 260388950, 1034867998, 908933415, 168810852, 1750902305, 2606453969, 607530554, 202008497, 2472011535, 3035535058, 463180190, 2160117071, 1641816226, 1517767529, 470948374, 3801332234, 3231722213, 1008918595, 303765277, 235474187, 4069246893, 766945465, 337553864, 1475418501, 2943682380, 4003061179, 2743034109, 4144047775, 1551037884, 1147550661, 1543208500, 2336434550, 3408119516, 3069049960, 3102011747, 3610369226, 1113818384, 328671808, 2227573024, 2236228733, 3535486456, 2935566865, 3341394285, 496906059, 3702665459, 226906860, 2009195472, 733156972, 2842737049, 294930682, 1206477858, 2835123396, 2700099354, 1451044056, 573804783, 2269728455, 3644379585, 2362090238, 2564033334, 2801107407, 2776292904, 3669462566, 1068351396, 742039012, 1350078989, 1784663195, 1417561698, 4136440770, 2430122216, 775550814, 2193862645, 2673705150, 1775276924, 1876241833, 3475313331, 3366754619, 270040487, 3902563182, 3678124923, 3441850377, 1851332852, 3969562369, 2203032232, 3868552805, 2868897406, 566021896, 4011190502, 3135740889, 1248802510, 3936291284, 699432150, 832877231, 708780849, 3332740144, 899835584, 1951317047, 4236429990, 3767586992, 866637845, 4043610186, 1106041591, 2144161806, 395441711, 1984812685, 1139781709, 3433712980, 3835036895, 2664543715, 1282050075, 3240894392, 1181045119, 2640243204, 25965917, 4203181171, 4211818798, 3009879386, 2463879762, 3910161971, 1842759443, 2597806476, 933301370, 1509430414, 3943906441, 3467192302, 3076639029, 3776767469, 2051518780, 2631065433, 1441952575, 404016761, 1942435775, 1408749034, 1610459739, 3745345300, 2017778566, 3400528769, 3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627, 4279080257, 967311729, 135050206, 3635733660, 1683407248, 2076935265, 3576870512, 1215061108, 3501741890], td = [1347548327, 1400783205, 3273267108, 2520393566, 3409685355, 4045380933, 2880240216, 2471224067, 1428173050, 4138563181, 2441661558, 636813900, 4233094615, 3620022987, 2149987652, 2411029155, 1239331162, 1730525723, 2554718734, 3781033664, 46346101, 310463728, 2743944855, 3328955385, 3875770207, 2501218972, 3955191162, 3667219033, 768917123, 3545789473, 692707433, 1150208456, 1786102409, 2029293177, 1805211710, 3710368113, 3065962831, 401639597, 1724457132, 3028143674, 409198410, 2196052529, 1620529459, 1164071807, 3769721975, 2226875310, 486441376, 2499348523, 1483753576, 428819965, 2274680428, 3075636216, 598438867, 3799141122, 1474502543, 711349675, 129166120, 53458370, 2592523643, 2782082824, 4063242375, 2988687269, 3120694122, 1559041666, 730517276, 2460449204, 4042459122, 2706270690, 3446004468, 3573941694, 533804130, 2328143614, 2637442643, 2695033685, 839224033, 1973745387, 957055980, 2856345839, 106852767, 1371368976, 4181598602, 1033297158, 2933734917, 1179510461, 3046200461, 91341917, 1862534868, 4284502037, 605657339, 2547432937, 3431546947, 2003294622, 3182487618, 2282195339, 954669403, 3682191598, 1201765386, 3917234703, 3388507166, 0, 2198438022, 1211247597, 2887651696, 1315723890, 4227665663, 1443857720, 507358933, 657861945, 1678381017, 560487590, 3516619604, 975451694, 2970356327, 261314535, 3535072918, 2652609425, 1333838021, 2724322336, 1767536459, 370938394, 182621114, 3854606378, 1128014560, 487725847, 185469197, 2918353863, 3106780840, 3356761769, 2237133081, 1286567175, 3152976349, 4255350624, 2683765030, 3160175349, 3309594171, 878443390, 1988838185, 3704300486, 1756818940, 1673061617, 3403100636, 272786309, 1075025698, 545572369, 2105887268, 4174560061, 296679730, 1841768865, 1260232239, 4091327024, 3960309330, 3497509347, 1814803222, 2578018489, 4195456072, 575138148, 3299409036, 446754879, 3629546796, 4011996048, 3347532110, 3252238545, 4270639778, 915985419, 3483825537, 681933534, 651868046, 2755636671, 3828103837, 223377554, 2607439820, 1649704518, 3270937875, 3901806776, 1580087799, 4118987695, 3198115200, 2087309459, 2842678573, 3016697106, 1003007129, 2802849917, 1860738147, 2077965243, 164439672, 4100872472, 32283319, 2827177882, 1709610350, 2125135846, 136428751, 3874428392, 3652904859, 3460984630, 3572145929, 3593056380, 2939266226, 824852259, 818324884, 3224740454, 930369212, 2801566410, 2967507152, 355706840, 1257309336, 4148292826, 243256656, 790073846, 2373340630, 1296297904, 1422699085, 3756299780, 3818836405, 457992840, 3099667487, 2135319889, 77422314, 1560382517, 1945798516, 788204353, 1521706781, 1385356242, 870912086, 325965383, 2358957921, 2050466060, 2388260884, 2313884476, 4006521127, 901210569, 3990953189, 1014646705, 1503449823, 1062597235, 2031621326, 3212035895, 3931371469, 1533017514, 350174575, 2256028891, 2177544179, 1052338372, 741876788, 1606591296, 1914052035, 213705253, 2334669897, 1107234197, 1899603969, 3725069491, 2631447780, 2422494913, 1635502980, 1893020342, 1950903388, 1120974935], nd = [2807058932, 1699970625, 2764249623, 1586903591, 1808481195, 1173430173, 1487645946, 59984867, 4199882800, 1844882806, 1989249228, 1277555970, 3623636965, 3419915562, 1149249077, 2744104290, 1514790577, 459744698, 244860394, 3235995134, 1963115311, 4027744588, 2544078150, 4190530515, 1608975247, 2627016082, 2062270317, 1507497298, 2200818878, 567498868, 1764313568, 3359936201, 2305455554, 2037970062, 1047239e3, 1910319033, 1337376481, 2904027272, 2892417312, 984907214, 1243112415, 830661914, 861968209, 2135253587, 2011214180, 2927934315, 2686254721, 731183368, 1750626376, 4246310725, 1820824798, 4172763771, 3542330227, 48394827, 2404901663, 2871682645, 671593195, 3254988725, 2073724613, 145085239, 2280796200, 2779915199, 1790575107, 2187128086, 472615631, 3029510009, 4075877127, 3802222185, 4107101658, 3201631749, 1646252340, 4270507174, 1402811438, 1436590835, 3778151818, 3950355702, 3963161475, 4020912224, 2667994737, 273792366, 2331590177, 104699613, 95345982, 3175501286, 2377486676, 1560637892, 3564045318, 369057872, 4213447064, 3919042237, 1137477952, 2658625497, 1119727848, 2340947849, 1530455833, 4007360968, 172466556, 266959938, 516552836, 0, 2256734592, 3980931627, 1890328081, 1917742170, 4294704398, 945164165, 3575528878, 958871085, 3647212047, 2787207260, 1423022939, 775562294, 1739656202, 3876557655, 2530391278, 2443058075, 3310321856, 547512796, 1265195639, 437656594, 3121275539, 719700128, 3762502690, 387781147, 218828297, 3350065803, 2830708150, 2848461854, 428169201, 122466165, 3720081049, 1627235199, 648017665, 4122762354, 1002783846, 2117360635, 695634755, 3336358691, 4234721005, 4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898, 1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670, 3822090177, 376187827, 3113855344, 1224348052, 1679968233, 2361698556, 1058709744, 752375421, 2431590963, 1321699145, 3519142200, 2734591178, 188127444, 2177869557, 3727205754, 2384911031, 3215212461, 2648976442, 2450346104, 3432737375, 1180849278, 331544205, 3102249176, 4150144569, 2952102595, 2159976285, 2474404304, 766078933, 313773861, 2570832044, 2108100632, 1668212892, 3145456443, 2013908262, 418672217, 3070356634, 2594734927, 1852171925, 3867060991, 3473416636, 3907448597, 2614737639, 919489135, 164948639, 2094410160, 2997825956, 590424639, 2486224549, 1723872674, 3157750862, 3399941250, 3501252752, 3625268135, 2555048196, 3673637356, 1343127501, 4130281361, 3599595085, 2957853679, 1297403050, 81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974, 895287692, 1953757831, 1093597963, 492483431, 3528626907, 1446242576, 1192455638, 1636604631, 209336225, 344873464, 1015671571, 669961897, 3375740769, 3857572124, 2973530695, 3747192018, 1933530610, 3464042516, 935293895, 3454686199, 2858115069, 1863638845, 3683022916, 4085369519, 3292445032, 875313188, 1080017571, 3279033885, 621591778, 1233856572, 2504130317, 24197544, 3017672716, 3835484340, 3247465558, 2220981195, 3060847922, 1551124588, 1463996600], rd = [4104605777, 1097159550, 396673818, 660510266, 2875968315, 2638606623, 4200115116, 3808662347, 821712160, 1986918061, 3430322568, 38544885, 3856137295, 718002117, 893681702, 1654886325, 2975484382, 3122358053, 3926825029, 4274053469, 796197571, 1290801793, 1184342925, 3556361835, 2405426947, 2459735317, 1836772287, 1381620373, 3196267988, 1948373848, 3764988233, 3385345166, 3263785589, 2390325492, 1480485785, 3111247143, 3780097726, 2293045232, 548169417, 3459953789, 3746175075, 439452389, 1362321559, 1400849762, 1685577905, 1806599355, 2174754046, 137073913, 1214797936, 1174215055, 3731654548, 2079897426, 1943217067, 1258480242, 529487843, 1437280870, 3945269170, 3049390895, 3313212038, 923313619, 679998e3, 3215307299, 57326082, 377642221, 3474729866, 2041877159, 133361907, 1776460110, 3673476453, 96392454, 878845905, 2801699524, 777231668, 4082475170, 2330014213, 4142626212, 2213296395, 1626319424, 1906247262, 1846563261, 562755902, 3708173718, 1040559837, 3871163981, 1418573201, 3294430577, 114585348, 1343618912, 2566595609, 3186202582, 1078185097, 3651041127, 3896688048, 2307622919, 425408743, 3371096953, 2081048481, 1108339068, 2216610296, 0, 2156299017, 736970802, 292596766, 1517440620, 251657213, 2235061775, 2933202493, 758720310, 265905162, 1554391400, 1532285339, 908999204, 174567692, 1474760595, 4002861748, 2610011675, 3234156416, 3693126241, 2001430874, 303699484, 2478443234, 2687165888, 585122620, 454499602, 151849742, 2345119218, 3064510765, 514443284, 4044981591, 1963412655, 2581445614, 2137062819, 19308535, 1928707164, 1715193156, 4219352155, 1126790795, 600235211, 3992742070, 3841024952, 836553431, 1669664834, 2535604243, 3323011204, 1243905413, 3141400786, 4180808110, 698445255, 2653899549, 2989552604, 2253581325, 3252932727, 3004591147, 1891211689, 2487810577, 3915653703, 4237083816, 4030667424, 2100090966, 865136418, 1229899655, 953270745, 3399679628, 3557504664, 4118925222, 2061379749, 3079546586, 2915017791, 983426092, 2022837584, 1607244650, 2118541908, 2366882550, 3635996816, 972512814, 3283088770, 1568718495, 3499326569, 3576539503, 621982671, 2895723464, 410887952, 2623762152, 1002142683, 645401037, 1494807662, 2595684844, 1335535747, 2507040230, 4293295786, 3167684641, 367585007, 3885750714, 1865862730, 2668221674, 2960971305, 2763173681, 1059270954, 2777952454, 2724642869, 1320957812, 2194319100, 2429595872, 2815956275, 77089521, 3973773121, 3444575871, 2448830231, 1305906550, 4021308739, 2857194700, 2516901860, 3518358430, 1787304780, 740276417, 1699839814, 1592394909, 2352307457, 2272556026, 188821243, 1729977011, 3687994002, 274084841, 3594982253, 3613494426, 2701949495, 4162096729, 322734571, 2837966542, 1640576439, 484830689, 1202797690, 3537852828, 4067639125, 349075736, 3342319475, 4157467219, 4255800159, 1030690015, 1155237496, 2951971274, 1757691577, 607398968, 2738905026, 499347990, 3794078908, 1011452712, 227885567, 2818666809, 213114376, 3034881240, 1455525988, 3414450555, 850817237, 1817998408, 3092726480], sd = [0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554, 708780849, 1883793496, 2118214995, 1817866830, 1649639237, 1215061108, 1181045119, 1417561698, 1517767529, 3767586992, 4003061179, 4236429990, 4069246893, 3635733660, 3602770327, 3299278474, 3400528769, 2430122216, 2664543715, 2362090238, 2193862645, 2835123396, 2801107407, 3035535058, 3135740889, 3678124923, 3576870512, 3341394285, 3374361702, 3810496343, 3977675356, 4279080257, 4043610186, 2876494627, 2776292904, 3076639029, 3110650942, 2472011535, 2640243204, 2403728665, 2169303058, 1001089995, 899835584, 666464733, 699432150, 59727847, 226906860, 530400753, 294930682, 1273168787, 1172967064, 1475418501, 1509430414, 1942435775, 2110667444, 1876241833, 1641816226, 2910219766, 2743034109, 2976151520, 3211623147, 2505202138, 2606453969, 2302690252, 2269728455, 3711829422, 3543599269, 3240894392, 3475313331, 3843699074, 3943906441, 4178062228, 4144047775, 1306967366, 1139781709, 1374988112, 1610459739, 1975683434, 2076935265, 1775276924, 1742315127, 1034867998, 866637845, 566021896, 800440835, 92987698, 193195065, 429456164, 395441711, 1984812685, 2017778566, 1784663195, 1683407248, 1315562145, 1080094634, 1383856311, 1551037884, 101039829, 135050206, 437757123, 337553864, 1042385657, 807962610, 573804783, 742039012, 2531067453, 2564033334, 2328828971, 2227573024, 2935566865, 2700099354, 3001755655, 3168937228, 3868552805, 3902563182, 4203181171, 4102977912, 3736164937, 3501741890, 3265478751, 3433712980, 1106041591, 1340463100, 1576976609, 1408749034, 2043211483, 2009195472, 1708848333, 1809054150, 832877231, 1068351396, 766945465, 599762354, 159417987, 126454664, 361929877, 463180190, 2709260871, 2943682380, 3178106961, 3009879386, 2572697195, 2538681184, 2236228733, 2336434550, 3509871135, 3745345300, 3441850377, 3274667266, 3910161971, 3877198648, 4110568485, 4211818798, 2597806476, 2497604743, 2261089178, 2295101073, 2733856160, 2902087851, 3202437046, 2968011453, 3936291284, 3835036895, 4136440770, 4169408201, 3535486456, 3702665459, 3467192302, 3231722213, 2051518780, 1951317047, 1716890410, 1750902305, 1113818384, 1282050075, 1584504582, 1350078989, 168810852, 67556463, 371049330, 404016761, 841739592, 1008918595, 775550814, 540080725, 3969562369, 3801332234, 4035489047, 4269907996, 3569255213, 3669462566, 3366754619, 3332740144, 2631065433, 2463879762, 2160117071, 2395588676, 2767645557, 2868897406, 3102011747, 3069049960, 202008497, 33778362, 270040487, 504459436, 875451293, 975658646, 675039627, 641025152, 2084704233, 1917518562, 1615861247, 1851332852, 1147550661, 1248802510, 1484005843, 1451044056, 933301370, 967311729, 733156972, 632953703, 260388950, 25965917, 328671808, 496906059, 1206477858, 1239443753, 1543208500, 1441952575, 2144161806, 1908694277, 1675577880, 1842759443, 3610369226, 3644379585, 3408119516, 3307916247, 4011190502, 3776767469, 4077384432, 4245618683, 2809771154, 2842737049, 3144396420, 3043140495, 2673705150, 2438237621, 2203032232, 2370213795], id = [0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694, 824852259, 1483753576, 1400783205, 1315723890, 1164071807, 1950903388, 2135319889, 1649704518, 1767536459, 2967507152, 3152976349, 2801566410, 2918353863, 2631447780, 2547432937, 2328143614, 2177544179, 3901806776, 3818836405, 4270639778, 4118987695, 3299409036, 3483825537, 3535072918, 3652904859, 2077965243, 1893020342, 1841768865, 1724457132, 1474502543, 1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569, 1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355, 3224740454, 3710368113, 3593056380, 3875770207, 3960309330, 4045380933, 4195456072, 2471224067, 2554718734, 2237133081, 2388260884, 3212035895, 3028143674, 2842678573, 2724322336, 4138563181, 4255350624, 3769721975, 3955191162, 3667219033, 3516619604, 3431546947, 3347532110, 2933734917, 2782082824, 3099667487, 3016697106, 2196052529, 2313884476, 2499348523, 2683765030, 1179510461, 1296297904, 1347548327, 1533017514, 1786102409, 1635502980, 2087309459, 2003294622, 507358933, 355706840, 136428751, 53458370, 839224033, 957055980, 605657339, 790073846, 2373340630, 2256028891, 2607439820, 2422494913, 2706270690, 2856345839, 3075636216, 3160175349, 3573941694, 3725069491, 3273267108, 3356761769, 4181598602, 4063242375, 4011996048, 3828103837, 1033297158, 915985419, 730517276, 545572369, 296679730, 446754879, 129166120, 213705253, 1709610350, 1860738147, 1945798516, 2029293177, 1239331162, 1120974935, 1606591296, 1422699085, 4148292826, 4233094615, 3781033664, 3931371469, 3682191598, 3497509347, 3446004468, 3328955385, 2939266226, 2755636671, 3106780840, 2988687269, 2198438022, 2282195339, 2501218972, 2652609425, 1201765386, 1286567175, 1371368976, 1521706781, 1805211710, 1620529459, 2105887268, 1988838185, 533804130, 350174575, 164439672, 46346101, 870912086, 954669403, 636813900, 788204353, 2358957921, 2274680428, 2592523643, 2441661558, 2695033685, 2880240216, 3065962831, 3182487618, 3572145929, 3756299780, 3270937875, 3388507166, 4174560061, 4091327024, 4006521127, 3854606378, 1014646705, 930369212, 711349675, 560487590, 272786309, 457992840, 106852767, 223377554, 1678381017, 1862534868, 1914052035, 2031621326, 1211247597, 1128014560, 1580087799, 1428173050, 32283319, 182621114, 401639597, 486441376, 768917123, 651868046, 1003007129, 818324884, 1503449823, 1385356242, 1333838021, 1150208456, 1973745387, 2125135846, 1673061617, 1756818940, 2970356327, 3120694122, 2802849917, 2887651696, 2637442643, 2520393566, 2334669897, 2149987652, 3917234703, 3799141122, 4284502037, 4100872472, 3309594171, 3460984630, 3545789473, 3629546796, 2050466060, 1899603969, 1814803222, 1730525723, 1443857720, 1560382517, 1075025698, 1260232239, 575138148, 692707433, 878443390, 1062597235, 243256656, 91341917, 409198410, 325965383, 3403100636, 3252238545, 3704300486, 3620022987, 3874428392, 3990953189, 4042459122, 4227665663, 2460449204, 2578018489, 2226875310, 2411029155, 3198115200, 3046200461, 2827177882, 2743944855], ad = [0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294, 590424639, 1750626376, 1699970625, 1917742170, 2135253587, 1551124588, 1367295589, 1180849278, 1265195639, 3501252752, 3720081049, 3399941250, 3350065803, 3835484340, 3919042237, 4270507174, 4085369519, 3102249176, 3051593425, 2734591178, 2952102595, 2361698556, 2177869557, 2530391278, 2614737639, 3145456443, 3060847922, 2708326185, 2892417312, 2404901663, 2187128086, 2504130317, 2555048196, 3542330227, 3727205754, 3375740769, 3292445032, 3876557655, 3926170974, 4246310725, 4027744588, 1808481195, 1723872674, 1910319033, 2094410160, 1608975247, 1391201670, 1173430173, 1224348052, 59984867, 244860394, 428169201, 344873464, 935293895, 984907214, 766078933, 547512796, 1844882806, 1627235199, 2011214180, 2062270317, 1507497298, 1423022939, 1137477952, 1321699145, 95345982, 145085239, 532201772, 313773861, 830661914, 1015671571, 731183368, 648017665, 3175501286, 2957853679, 2807058932, 2858115069, 2305455554, 2220981195, 2474404304, 2658625497, 3575528878, 3625268135, 3473416636, 3254988725, 3778151818, 3963161475, 4213447064, 4130281361, 3599595085, 3683022916, 3432737375, 3247465558, 3802222185, 4020912224, 4172763771, 4122762354, 3201631749, 3017672716, 2764249623, 2848461854, 2331590177, 2280796200, 2431590963, 2648976442, 104699613, 188127444, 472615631, 287343814, 840019705, 1058709744, 671593195, 621591778, 1852171925, 1668212892, 1953757831, 2037970062, 1514790577, 1463996600, 1080017571, 1297403050, 3673637356, 3623636965, 3235995134, 3454686199, 4007360968, 3822090177, 4107101658, 4190530515, 2997825956, 3215212461, 2830708150, 2779915199, 2256734592, 2340947849, 2627016082, 2443058075, 172466556, 122466165, 273792366, 492483431, 1047239e3, 861968209, 612205898, 695634755, 1646252340, 1863638845, 2013908262, 1963115311, 1446242576, 1530455833, 1277555970, 1093597963, 1636604631, 1820824798, 2073724613, 1989249228, 1436590835, 1487645946, 1337376481, 1119727848, 164948639, 81781910, 331544205, 516552836, 1039717051, 821288114, 669961897, 719700128, 2973530695, 3157750862, 2871682645, 2787207260, 2232435299, 2283490410, 2667994737, 2450346104, 3647212047, 3564045318, 3279033885, 3464042516, 3980931627, 3762502690, 4150144569, 4199882800, 3070356634, 3121275539, 2904027272, 2686254721, 2200818878, 2384911031, 2570832044, 2486224549, 3747192018, 3528626907, 3310321856, 3359936201, 3950355702, 3867060991, 4049844452, 4234721005, 1739656202, 1790575107, 2108100632, 1890328081, 1402811438, 1586903591, 1233856572, 1149249077, 266959938, 48394827, 369057872, 418672217, 1002783846, 919489135, 567498868, 752375421, 209336225, 24197544, 376187827, 459744698, 945164165, 895287692, 574624663, 793451934, 1679968233, 1764313568, 2117360635, 1933530610, 1343127501, 1560637892, 1243112415, 1192455638, 3704280881, 3519142200, 3336358691, 3419915562, 3907448597, 3857572124, 4075877127, 4294704398, 3029510009, 3113855344, 2927934315, 2744104290, 2159976285, 2377486676, 2594734927, 2544078150], od = [0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204, 1059270954, 1214797936, 1097159550, 1517440620, 1400849762, 1817998408, 1699839814, 2118541908, 2001430874, 2429595872, 2581445614, 2194319100, 2345119218, 3034881240, 3186202582, 2801699524, 2951971274, 3635996816, 3518358430, 3399679628, 3283088770, 4237083816, 4118925222, 4002861748, 3885750714, 1002142683, 850817237, 698445255, 548169417, 529487843, 377642221, 227885567, 77089521, 1943217067, 2061379749, 1640576439, 1757691577, 1474760595, 1592394909, 1174215055, 1290801793, 2875968315, 2724642869, 3111247143, 2960971305, 2405426947, 2253581325, 2638606623, 2487810577, 3808662347, 3926825029, 4044981591, 4162096729, 3342319475, 3459953789, 3576539503, 3693126241, 1986918061, 2137062819, 1685577905, 1836772287, 1381620373, 1532285339, 1078185097, 1229899655, 1040559837, 923313619, 740276417, 621982671, 439452389, 322734571, 137073913, 19308535, 3871163981, 4021308739, 4104605777, 4255800159, 3263785589, 3414450555, 3499326569, 3651041127, 2933202493, 2815956275, 3167684641, 3049390895, 2330014213, 2213296395, 2566595609, 2448830231, 1305906550, 1155237496, 1607244650, 1455525988, 1776460110, 1626319424, 2079897426, 1928707164, 96392454, 213114376, 396673818, 514443284, 562755902, 679998e3, 865136418, 983426092, 3708173718, 3557504664, 3474729866, 3323011204, 4180808110, 4030667424, 3945269170, 3794078908, 2507040230, 2623762152, 2272556026, 2390325492, 2975484382, 3092726480, 2738905026, 2857194700, 3973773121, 3856137295, 4274053469, 4157467219, 3371096953, 3252932727, 3673476453, 3556361835, 2763173681, 2915017791, 3064510765, 3215307299, 2156299017, 2307622919, 2459735317, 2610011675, 2081048481, 1963412655, 1846563261, 1729977011, 1480485785, 1362321559, 1243905413, 1126790795, 878845905, 1030690015, 645401037, 796197571, 274084841, 425408743, 38544885, 188821243, 3613494426, 3731654548, 3313212038, 3430322568, 4082475170, 4200115116, 3780097726, 3896688048, 2668221674, 2516901860, 2366882550, 2216610296, 3141400786, 2989552604, 2837966542, 2687165888, 1202797690, 1320957812, 1437280870, 1554391400, 1669664834, 1787304780, 1906247262, 2022837584, 265905162, 114585348, 499347990, 349075736, 736970802, 585122620, 972512814, 821712160, 2595684844, 2478443234, 2293045232, 2174754046, 3196267988, 3079546586, 2895723464, 2777952454, 3537852828, 3687994002, 3234156416, 3385345166, 4142626212, 4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952, 292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068, 1258480242, 1343618912, 1494807662, 1715193156, 1865862730, 1948373848, 2100090966, 2701949495, 2818666809, 3004591147, 3122358053, 2235061775, 2352307457, 2535604243, 2653899549, 3915653703, 3764988233, 4219352155, 4067639125, 3444575871, 3294430577, 3746175075, 3594982253, 836553431, 953270745, 600235211, 718002117, 367585007, 484830689, 133361907, 251657213, 2041877159, 1891211689, 1806599355, 1654886325, 1568718495, 1418573201, 1335535747, 1184342925];
function Ki(n31) {
  let e = [];
  for (let t = 0; t < n31.length; t += 4) e.push(n31[t] << 24 | n31[t + 1] << 16 | n31[t + 2] << 8 | n31[t + 3]);
  return e;
}
var Sr = class n25 {
  get key() {
    return ve(this, Cs, "f").slice();
  }
  constructor(e) {
    if (Cs.set(this, void 0), je.set(this, void 0), ht.set(this, void 0), !(this instanceof n25)) throw Error("AES must be instanitated with `new`");
    Vi(this, Cs, new Uint8Array(e), "f");
    let t = ql[this.key.length];
    if (t == null) throw new TypeError("invalid key size (must be 16, 24 or 32 bytes)");
    Vi(this, ht, [], "f"), Vi(this, je, [], "f");
    for (let d = 0; d <= t; d++) ve(this, ht, "f").push([0, 0, 0, 0]), ve(this, je, "f").push([0, 0, 0, 0]);
    let r = (t + 1) * 4, s = this.key.length / 4, i = Ki(this.key), a;
    for (let d = 0; d < s; d++) a = d >> 2, ve(this, ht, "f")[a][d % 4] = i[d], ve(this, je, "f")[t - a][d % 4] = i[d];
    let o = 0, c = s, f;
    for (; c < r; ) {
      if (f = i[s - 1], i[0] ^= qe[f >> 16 & 255] << 24 ^ qe[f >> 8 & 255] << 16 ^ qe[f & 255] << 8 ^ qe[f >> 24 & 255] ^ jl[o] << 24, o += 1, s != 8) for (let p = 1; p < s; p++) i[p] ^= i[p - 1];
      else {
        for (let p = 1; p < s / 2; p++) i[p] ^= i[p - 1];
        f = i[s / 2 - 1], i[s / 2] ^= qe[f & 255] ^ qe[f >> 8 & 255] << 8 ^ qe[f >> 16 & 255] << 16 ^ qe[f >> 24 & 255] << 24;
        for (let p = s / 2 + 1; p < s; p++) i[p] ^= i[p - 1];
      }
      let d = 0, l, x;
      for (; d < s && c < r; ) l = c >> 2, x = c % 4, ve(this, ht, "f")[l][x] = i[d], ve(this, je, "f")[t - l][x] = i[d++], c++;
    }
    for (let d = 1; d < t; d++) for (let l = 0; l < 4; l++) f = ve(this, je, "f")[d][l], ve(this, je, "f")[d][l] = sd[f >> 24 & 255] ^ id[f >> 16 & 255] ^ ad[f >> 8 & 255] ^ od[f & 255];
  }
  encrypt(e) {
    if (e.length != 16) throw new TypeError("invalid plaintext size (must be 16 bytes)");
    let t = ve(this, ht, "f").length - 1, r = [0, 0, 0, 0], s = Ki(e);
    for (let o = 0; o < 4; o++) s[o] ^= ve(this, ht, "f")[0][o];
    for (let o = 1; o < t; o++) {
      for (let c = 0; c < 4; c++) r[c] = Zl[s[c] >> 24 & 255] ^ Yl[s[(c + 1) % 4] >> 16 & 255] ^ Xl[s[(c + 2) % 4] >> 8 & 255] ^ Ql[s[(c + 3) % 4] & 255] ^ ve(this, ht, "f")[o][c];
      s = r.slice();
    }
    let i = new Uint8Array(16), a = 0;
    for (let o = 0; o < 4; o++) a = ve(this, ht, "f")[t][o], i[4 * o] = (qe[s[o] >> 24 & 255] ^ a >> 24) & 255, i[4 * o + 1] = (qe[s[(o + 1) % 4] >> 16 & 255] ^ a >> 16) & 255, i[4 * o + 2] = (qe[s[(o + 2) % 4] >> 8 & 255] ^ a >> 8) & 255, i[4 * o + 3] = (qe[s[(o + 3) % 4] & 255] ^ a) & 255;
    return i;
  }
  decrypt(e) {
    if (e.length != 16) throw new TypeError("invalid ciphertext size (must be 16 bytes)");
    let t = ve(this, je, "f").length - 1, r = [0, 0, 0, 0], s = Ki(e);
    for (let o = 0; o < 4; o++) s[o] ^= ve(this, je, "f")[0][o];
    for (let o = 1; o < t; o++) {
      for (let c = 0; c < 4; c++) r[c] = ed[s[c] >> 24 & 255] ^ td[s[(c + 3) % 4] >> 16 & 255] ^ nd[s[(c + 2) % 4] >> 8 & 255] ^ rd[s[(c + 1) % 4] & 255] ^ ve(this, je, "f")[o][c];
      s = r.slice();
    }
    let i = new Uint8Array(16), a = 0;
    for (let o = 0; o < 4; o++) a = ve(this, je, "f")[t][o], i[4 * o] = (Os[s[o] >> 24 & 255] ^ a >> 24) & 255, i[4 * o + 1] = (Os[s[(o + 3) % 4] >> 16 & 255] ^ a >> 16) & 255, i[4 * o + 2] = (Os[s[(o + 2) % 4] >> 8 & 255] ^ a >> 8) & 255, i[4 * o + 3] = (Os[s[(o + 1) % 4] & 255] ^ a) & 255;
    return i;
  }
};
Cs = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ new WeakMap(), ht = /* @__PURE__ */ new WeakMap();
var pt = class {
  constructor(e, t, r) {
    if (r && !(this instanceof r)) throw new Error(`${e} must be instantiated with "new"`);
    Object.defineProperties(this, { aes: { enumerable: true, value: new Sr(t) }, name: { enumerable: true, value: e } });
  }
};
var Ls = function(n31, e, t, r, s) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !s) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n31 !== e || !s : !e.has(n31)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? s.call(n31, t) : s ? s.value = t : e.set(n31, t), t;
}, er = function(n31, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n31 !== e || !r : !e.has(n31)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(n31) : r ? r.value : e.get(n31);
}, Br, Rt, Pr = class n26 extends pt {
  constructor(e, t) {
    if (super("ECC", e, n26), Br.set(this, void 0), Rt.set(this, void 0), t) {
      if (t.length % 16) throw new TypeError("invalid iv size (must be 16 bytes)");
      Ls(this, Br, new Uint8Array(t), "f");
    } else Ls(this, Br, new Uint8Array(16), "f");
    Ls(this, Rt, this.iv, "f");
  }
  get iv() {
    return new Uint8Array(er(this, Br, "f"));
  }
  encrypt(e) {
    if (e.length % 16) throw new TypeError("invalid plaintext size (must be multiple of 16 bytes)");
    let t = new Uint8Array(e.length);
    for (let r = 0; r < e.length; r += 16) {
      for (let s = 0; s < 16; s++) er(this, Rt, "f")[s] ^= e[r + s];
      Ls(this, Rt, this.aes.encrypt(er(this, Rt, "f")), "f"), t.set(er(this, Rt, "f"), r);
    }
    return t;
  }
  decrypt(e) {
    if (e.length % 16) throw new TypeError("invalid ciphertext size (must be multiple of 16 bytes)");
    let t = new Uint8Array(e.length);
    for (let r = 0; r < e.length; r += 16) {
      let s = this.aes.decrypt(e.subarray(r, r + 16));
      for (let i = 0; i < 16; i++) t[r + i] = s[i] ^ er(this, Rt, "f")[i], er(this, Rt, "f")[i] = e[r + i];
    }
    return t;
  }
};
Br = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap();
var Wi = function(n31, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n31 !== e || !r : !e.has(n31)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(n31) : r ? r.value : e.get(n31);
}, cd, fd, Us, ld;
fd = /* @__PURE__ */ new WeakMap(), Us = /* @__PURE__ */ new WeakMap(), cd = /* @__PURE__ */ new WeakSet(), ld = function(e) {
  let t = this.segmentSize / 8;
  Wi(this, Us, "f").set(Wi(this, Us, "f").subarray(t)), Wi(this, Us, "f").set(e.subarray(0, t), 16 - t);
};
var tr = function(n31, e, t, r, s) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !s) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n31 !== e || !s : !e.has(n31)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? s.call(n31, t) : s ? s.value = t : e.set(n31, t), t;
}, Ze = function(n31, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n31 !== e || !r : !e.has(n31)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(n31) : r ? r.value : e.get(n31);
}, Nr, In, Ye, sn = class n27 extends pt {
  constructor(e, t) {
    super("CTR", e, n27), Nr.set(this, void 0), In.set(this, void 0), Ye.set(this, void 0), tr(this, Ye, new Uint8Array(16), "f"), Ze(this, Ye, "f").fill(0), tr(this, Nr, Ze(this, Ye, "f"), "f"), tr(this, In, 16, "f"), t == null && (t = 1), typeof t == "number" ? this.setCounterValue(t) : this.setCounterBytes(t);
  }
  get counter() {
    return new Uint8Array(Ze(this, Ye, "f"));
  }
  setCounterValue(e) {
    if (!Number.isInteger(e) || e < 0 || e > Number.MAX_SAFE_INTEGER) throw new TypeError("invalid counter initial integer value");
    for (let t = 15; t >= 0; --t) Ze(this, Ye, "f")[t] = e % 256, e = Math.floor(e / 256);
  }
  setCounterBytes(e) {
    if (e.length !== 16) throw new TypeError("invalid counter initial Uint8Array value length");
    Ze(this, Ye, "f").set(e);
  }
  increment() {
    for (let e = 15; e >= 0; e--) if (Ze(this, Ye, "f")[e] === 255) Ze(this, Ye, "f")[e] = 0;
    else {
      Ze(this, Ye, "f")[e]++;
      break;
    }
  }
  encrypt(e) {
    var t, r;
    let s = new Uint8Array(e);
    for (let i = 0; i < s.length; i++) Ze(this, In, "f") === 16 && (tr(this, Nr, this.aes.encrypt(Ze(this, Ye, "f")), "f"), tr(this, In, 0, "f"), this.increment()), s[i] ^= Ze(this, Nr, "f")[tr(this, In, (r = Ze(this, In, "f"), t = r++, r), "f"), t];
    return s;
  }
  decrypt(e) {
    return this.encrypt(e);
  }
};
Nr = /* @__PURE__ */ new WeakMap(), In = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ new WeakMap();
var dd, ud, xd;
dd = /* @__PURE__ */ new WeakMap(), ud = /* @__PURE__ */ new WeakMap(), xd = /* @__PURE__ */ new WeakMap();
function Ji(n31) {
  if (n31.length < 16) throw new TypeError("PKCS#7 invalid length");
  let e = n31[n31.length - 1];
  if (e > 16) throw new TypeError("PKCS#7 padding byte out of range");
  let t = n31.length - e;
  for (let r = 0; r < e; r++) if (n31[t + r] !== e) throw new TypeError("PKCS#7 invalid padding byte");
  return new Uint8Array(n31.subarray(0, t));
}
function qi(n31) {
  return typeof n31 == "string" && !n31.startsWith("0x") && (n31 = "0x" + n31), re(n31);
}
function nr(n31, e) {
  for (n31 = String(n31); n31.length < e; ) n31 = "0" + n31;
  return n31;
}
function kn(n31) {
  return typeof n31 == "string" ? me(n31, "NFKC") : re(n31);
}
function ae(n31, e) {
  let t = e.match(/^([a-z0-9$_.-]*)(:([a-z]+))?(!)?$/i);
  u(t != null, "invalid path", "path", e);
  let r = t[1], s = t[3], i = t[4] === "!", a = n31;
  for (let o of r.toLowerCase().split(".")) {
    if (Array.isArray(a)) {
      if (!o.match(/^[0-9]+$/)) break;
      a = a[parseInt(o)];
    } else if (typeof a == "object") {
      let c = null;
      for (let f in a) if (f.toLowerCase() === o) {
        c = a[f];
        break;
      }
      a = c;
    } else a = null;
    if (a == null) break;
  }
  if (u(!i || a != null, "missing required value", "path", r), s && a != null) {
    if (s === "int") {
      if (typeof a == "string" && a.match(/^-?[0-9]+$/)) return parseInt(a);
      if (Number.isSafeInteger(a)) return a;
    }
    if (s === "number" && typeof a == "string" && a.match(/^-?[0-9.]*$/)) return parseFloat(a);
    if (s === "data" && typeof a == "string") return qi(a);
    if (s === "array" && Array.isArray(a) || s === typeof a) return a;
    u(false, `wrong type found for ${s} `, "path", r);
  }
  return a;
}
var T0 = "m/44'/60'/0'/0/0";
function Fs(n31) {
  try {
    let e = JSON.parse(n31);
    if ((e.version != null ? parseInt(e.version) : 0) === 3) return true;
  } catch {
  }
  return false;
}
function hd(n31, e, t) {
  if (ae(n31, "crypto.cipher:string") === "aes-128-ctr") {
    let s = ae(n31, "crypto.cipherparams.iv:data!"), i = new sn(e, s);
    return g(i.decrypt(t));
  }
  k(false, "unsupported cipher", "UNSUPPORTED_OPERATION", { operation: "decrypt" });
}
function Ds(n31, e) {
  let t = v(e), r = ae(n31, "crypto.ciphertext:data!"), s = g(z(_([t.slice(16, 32), r]))).substring(2);
  u(s === ae(n31, "crypto.mac:string!").toLowerCase(), "incorrect password", "password", "[ REDACTED ]");
  let i = hd(n31, t.slice(0, 16), r), a = ut(i);
  if (n31.address) {
    let f = n31.address.toLowerCase();
    f.startsWith("0x") || (f = "0x" + f), u(q(f) === a, "keystore address/privateKey mismatch", "address", n31.address);
  }
  let o = { address: a, privateKey: i };
  if (ae(n31, "x-ethers.version:string") === "0.1") {
    let f = t.slice(32, 64), d = ae(n31, "x-ethers.mnemonicCiphertext:data!"), l = ae(n31, "x-ethers.mnemonicCounter:data!"), x = new sn(f, l);
    o.mnemonic = { path: ae(n31, "x-ethers.path:string") || T0, locale: ae(n31, "x-ethers.locale:string") || "en", entropy: g(v(x.decrypt(d))) };
  }
  return o;
}
function R0(n31) {
  let e = ae(n31, "crypto.kdf:string");
  if (e && typeof e == "string") {
    if (e.toLowerCase() === "scrypt") {
      let t = ae(n31, "crypto.kdfparams.salt:data!"), r = ae(n31, "crypto.kdfparams.n:int!"), s = ae(n31, "crypto.kdfparams.r:int!"), i = ae(n31, "crypto.kdfparams.p:int!");
      u(r > 0 && (r & r - 1) === 0, "invalid kdf.N", "kdf.N", r), u(s > 0 && i > 0, "invalid kdf", "kdf", e);
      let a = ae(n31, "crypto.kdfparams.dklen:int!");
      return u(a === 32, "invalid kdf.dklen", "kdf.dflen", a), { name: "scrypt", salt: t, N: r, r: s, p: i, dkLen: 64 };
    } else if (e.toLowerCase() === "pbkdf2") {
      let t = ae(n31, "crypto.kdfparams.salt:data!"), r = ae(n31, "crypto.kdfparams.prf:string!"), s = r.split("-").pop();
      u(s === "sha256" || s === "sha512", "invalid kdf.pdf", "kdf.pdf", r);
      let i = ae(n31, "crypto.kdfparams.c:int!"), a = ae(n31, "crypto.kdfparams.dklen:int!");
      return u(a === 32, "invalid kdf.dklen", "kdf.dklen", a), { name: "pbkdf2", salt: t, count: i, dkLen: a, algorithm: s };
    }
  }
  u(false, "unsupported key-derivation function", "kdf", e);
}
function ji(n31, e) {
  let t = JSON.parse(n31), r = kn(e), s = R0(t);
  if (s.name === "pbkdf2") {
    let { salt: l, count: x, dkLen: p, algorithm: b } = s, h = Ge(r, l, x, p, b);
    return Ds(t, h);
  }
  k(s.name === "scrypt", "cannot be reached", "UNKNOWN_ERROR", { params: s });
  let { salt: i, N: a, r: o, p: c, dkLen: f } = s, d = It(r, i, a, o, c, f);
  return Ds(t, d);
}
function N0(n31) {
  return new Promise((e) => {
    setTimeout(() => {
      e();
    }, n31);
  });
}
async function Zi(n31, e, t) {
  let r = JSON.parse(n31), s = kn(e), i = R0(r);
  if (i.name === "pbkdf2") {
    t && (t(0), await N0(0));
    let { salt: x, count: p, dkLen: b, algorithm: h } = i, m = Ge(s, x, p, b, h);
    return t && (t(1), await N0(0)), Ds(r, m);
  }
  k(i.name === "scrypt", "cannot be reached", "UNKNOWN_ERROR", { params: i });
  let { salt: a, N: o, r: c, p: f, dkLen: d } = i, l = await At(s, a, o, c, f, d, t);
  return Ds(r, l);
}
function O0(n31) {
  let e = n31.salt != null ? v(n31.salt, "options.salt") : _e(32), t = 1 << 17, r = 8, s = 1;
  return n31.scrypt && (n31.scrypt.N && (t = n31.scrypt.N), n31.scrypt.r && (r = n31.scrypt.r), n31.scrypt.p && (s = n31.scrypt.p)), u(typeof t == "number" && t > 0 && Number.isSafeInteger(t) && (BigInt(t) & BigInt(t - 1)) === BigInt(0), "invalid scrypt N parameter", "options.N", t), u(typeof r == "number" && r > 0 && Number.isSafeInteger(r), "invalid scrypt r parameter", "options.r", r), u(typeof s == "number" && s > 0 && Number.isSafeInteger(s), "invalid scrypt p parameter", "options.p", s), { name: "scrypt", dkLen: 32, salt: e, N: t, r, p: s };
}
function C0(n31, e, t, r) {
  let s = v(t.privateKey, "privateKey"), i = r.iv != null ? v(r.iv, "options.iv") : _e(16);
  u(i.length === 16, "invalid options.iv length", "options.iv", r.iv);
  let a = r.uuid != null ? v(r.uuid, "options.uuid") : _e(16);
  u(a.length === 16, "invalid options.uuid length", "options.uuid", r.iv);
  let o = n31.slice(0, 16), c = n31.slice(16, 32), f = new sn(o, i), d = v(f.encrypt(s)), l = z(_([c, d])), x = { address: t.address.substring(2).toLowerCase(), id: Wr(a), version: 3, Crypto: { cipher: "aes-128-ctr", cipherparams: { iv: g(i).substring(2) }, ciphertext: g(d).substring(2), kdf: "scrypt", kdfparams: { salt: g(e.salt).substring(2), n: e.N, dklen: 32, p: e.p, r: e.r }, mac: l.substring(2) } };
  if (t.mnemonic) {
    let p = r.client != null ? r.client : `ethers/${Fr}`, b = t.mnemonic.path || T0, h = t.mnemonic.locale || "en", m = n31.slice(32, 64), y = v(t.mnemonic.entropy, "account.mnemonic.entropy"), I = _e(16), E = new sn(m, I), C = v(E.encrypt(y)), S = /* @__PURE__ */ new Date(), T = "UTC--" + (S.getUTCFullYear() + "-" + nr(S.getUTCMonth() + 1, 2) + "-" + nr(S.getUTCDate(), 2) + "T" + nr(S.getUTCHours(), 2) + "-" + nr(S.getUTCMinutes(), 2) + "-" + nr(S.getUTCSeconds(), 2) + ".0Z") + "--" + x.address;
    x["x-ethers"] = { client: p, gethFilename: T, path: b, locale: h, mnemonicCounter: g(I).substring(2), mnemonicCiphertext: g(C).substring(2), version: "0.1" };
  }
  return JSON.stringify(x);
}
function Tr(n31, e, t) {
  t == null && (t = {});
  let r = kn(e), s = O0(t), i = It(r, s.salt, s.N, s.r, s.p, 64);
  return C0(v(i), s, n31, t);
}
async function Rr(n31, e, t) {
  t == null && (t = {});
  let r = kn(e), s = O0(t), i = await At(r, s.salt, s.N, s.r, s.p, 64, t.progressCallback);
  return C0(v(i), s, n31, t);
}
var Gs = "m/44'/60'/0'/0/0", pd = new Uint8Array([66, 105, 116, 99, 111, 105, 110, 32, 115, 101, 101, 100]), an = 2147483648, bd = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), md = "0123456789abcdef";
function _s(n31, e) {
  let t = "";
  for (; n31; ) t = md[n31 % 16] + t, n31 = Math.trunc(n31 / 16);
  for (; t.length < e * 2; ) t = "0" + t;
  return "0x" + t;
}
function Yi(n31) {
  let e = v(n31), t = De(ue(ue(e)), 0, 4), r = _([e, t]);
  return Hr(r);
}
var bt = {};
function L0(n31, e, t, r) {
  let s = new Uint8Array(37);
  n31 & an ? (k(r != null, "cannot derive child of neutered node", "UNSUPPORTED_OPERATION", { operation: "deriveChild" }), s.set(v(r), 1)) : s.set(v(t));
  for (let a = 24; a >= 0; a -= 8) s[33 + (a >> 3)] = n31 >> 24 - a & 255;
  let i = v(vt("sha512", e, s));
  return { IL: i.slice(0, 32), IR: i.slice(32) };
}
function U0(n31, e) {
  let t = e.split("/");
  u(t.length > 0, "invalid path", "path", e), t[0] === "m" && (u(n31.depth === 0, `cannot derive root path (i.e. path starting with "m/") for a node at non-zero depth ${n31.depth}`, "path", e), t.shift());
  let r = n31;
  for (let s = 0; s < t.length; s++) {
    let i = t[s];
    if (i.match(/^[0-9]+'$/)) {
      let a = parseInt(i.substring(0, i.length - 1));
      u(a < an, "invalid path index", `path[${s}]`, i), r = r.deriveChild(an + a);
    } else if (i.match(/^[0-9]+$/)) {
      let a = parseInt(i);
      u(a < an, "invalid path index", `path[${s}]`, i), r = r.deriveChild(a);
    } else u(false, "invalid path component", `path[${s}]`, i);
  }
  return r;
}
var Sn = class n28 extends An {
  publicKey;
  fingerprint;
  parentFingerprint;
  mnemonic;
  chainCode;
  path;
  index;
  depth;
  constructor(e, t, r, s, i, a, o, c, f) {
    super(t, f), Ae(e, bt, "HDNodeWallet"), R(this, { publicKey: t.compressedPublicKey });
    let d = De(Et(ue(this.publicKey)), 0, 4);
    R(this, { parentFingerprint: r, fingerprint: d, chainCode: s, path: i, index: a, depth: o }), R(this, { mnemonic: c });
  }
  connect(e) {
    return new n28(bt, this.signingKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, this.mnemonic, e);
  }
  #e() {
    let e = { address: this.address, privateKey: this.privateKey }, t = this.mnemonic;
    return this.path && t && t.wordlist.locale === "en" && t.password === "" && (e.mnemonic = { path: this.path, locale: "en", entropy: t.entropy }), e;
  }
  async encrypt(e, t) {
    return await Rr(this.#e(), e, { progressCallback: t });
  }
  encryptSync(e) {
    return Tr(this.#e(), e);
  }
  get extendedKey() {
    return k(this.depth < 256, "Depth too deep", "UNSUPPORTED_OPERATION", { operation: "extendedKey" }), Yi(_(["0x0488ADE4", _s(this.depth, 1), this.parentFingerprint, _s(this.index, 4), this.chainCode, _(["0x00", this.privateKey])]));
  }
  hasPath() {
    return this.path != null;
  }
  neuter() {
    return new Or(bt, this.address, this.publicKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, this.provider);
  }
  deriveChild(e) {
    let t = K(e, "index");
    u(t <= 4294967295, "invalid index", "index", t);
    let r = this.path;
    r && (r += "/" + (t & ~an), t & an && (r += "'"));
    let { IR: s, IL: i } = L0(t, this.chainCode, this.publicKey, this.privateKey), a = new Be(Ne((et(i) + BigInt(this.privateKey)) % bd, 32));
    return new n28(bt, a, this.fingerprint, g(s), r, t, this.depth + 1, this.mnemonic, this.provider);
  }
  derivePath(e) {
    return U0(this, e);
  }
  static #t(e, t) {
    u(lt(e), "invalid seed", "seed", "[REDACTED]");
    let r = v(e, "seed");
    u(r.length >= 16 && r.length <= 64, "invalid seed", "seed", "[REDACTED]");
    let s = v(vt("sha512", pd, r)), i = new Be(g(s.slice(0, 32)));
    return new n28(bt, i, "0x00000000", g(s.slice(32)), "m", 0, 0, t, null);
  }
  static fromExtendedKey(e) {
    let t = Y(Vr(e));
    u(t.length === 82 || Yi(t.slice(0, 78)) === e, "invalid extended key", "extendedKey", "[ REDACTED ]");
    let r = t[4], s = g(t.slice(5, 9)), i = parseInt(g(t.slice(9, 13)).substring(2), 16), a = g(t.slice(13, 45)), o = t.slice(45, 78);
    switch (g(t.slice(0, 4))) {
      case "0x0488b21e":
      case "0x043587cf": {
        let c = g(o);
        return new Or(bt, ut(c), c, s, a, null, i, r, null);
      }
      case "0x0488ade4":
      case "0x04358394 ":
        if (o[0] !== 0) break;
        return new n28(bt, new Be(o.slice(1)), s, a, null, i, r, null, null);
    }
    u(false, "invalid extended key prefix", "extendedKey", "[ REDACTED ]");
  }
  static createRandom(e, t, r) {
    e == null && (e = ""), t == null && (t = Gs), r == null && (r = Tt.wordlist());
    let s = rn.fromEntropy(_e(16), e, r);
    return n28.#t(s.computeSeed(), s).derivePath(t);
  }
  static fromMnemonic(e, t) {
    return t || (t = Gs), n28.#t(e.computeSeed(), e).derivePath(t);
  }
  static fromPhrase(e, t, r, s) {
    t == null && (t = ""), r == null && (r = Gs), s == null && (s = Tt.wordlist());
    let i = rn.fromPhrase(e, t, s);
    return n28.#t(i.computeSeed(), i).derivePath(r);
  }
  static fromSeed(e) {
    return n28.#t(e, null);
  }
}, Or = class n29 extends kr {
  publicKey;
  fingerprint;
  parentFingerprint;
  chainCode;
  path;
  index;
  depth;
  constructor(e, t, r, s, i, a, o, c, f) {
    super(t, f), Ae(e, bt, "HDNodeVoidWallet"), R(this, { publicKey: r });
    let d = De(Et(ue(r)), 0, 4);
    R(this, { publicKey: r, fingerprint: d, parentFingerprint: s, chainCode: i, path: a, index: o, depth: c });
  }
  connect(e) {
    return new n29(bt, this.address, this.publicKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, e);
  }
  get extendedKey() {
    return k(this.depth < 256, "Depth too deep", "UNSUPPORTED_OPERATION", { operation: "extendedKey" }), Yi(_(["0x0488B21E", _s(this.depth, 1), this.parentFingerprint, _s(this.index, 4), this.chainCode, this.publicKey]));
  }
  hasPath() {
    return this.path != null;
  }
  deriveChild(e) {
    let t = K(e, "index");
    u(t <= 4294967295, "invalid index", "index", t);
    let r = this.path;
    r && (r += "/" + (t & ~an), t & an && (r += "'"));
    let { IR: s, IL: i } = L0(t, this.chainCode, this.publicKey, null), a = Be.addPoints(i, this.publicKey, true), o = ut(a);
    return new n29(bt, o, a, this.fingerprint, g(s), r, t, this.depth + 1, this.provider);
  }
  derivePath(e) {
    return U0(this, e);
  }
};
function $s(n31) {
  try {
    if (JSON.parse(n31).encseed) return true;
  } catch {
  }
  return false;
}
function Ms(n31, e) {
  let t = JSON.parse(n31), r = kn(e), s = q(ae(t, "ethaddr:string!")), i = qi(ae(t, "encseed:string!"));
  u(i && i.length % 16 === 0, "invalid encseed", "json", n31);
  let a = v(Ge(r, r, 2e3, 32, "sha256")).slice(0, 16), o = i.slice(0, 16), c = i.slice(16), f = new Pr(a, o), d = Ji(v(f.decrypt(c))), l = "";
  for (let x = 0; x < d.length; x++) l += String.fromCharCode(d[x]);
  return { address: s, privateKey: Te(l) };
}
function D0(n31) {
  return new Promise((e) => {
    setTimeout(() => {
      e();
    }, n31);
  });
}
var rr = class n30 extends An {
  constructor(e, t) {
    typeof e == "string" && !e.startsWith("0x") && (e = "0x" + e);
    let r = typeof e == "string" ? new Be(e) : e;
    super(r, t);
  }
  connect(e) {
    return new n30(this.signingKey, e);
  }
  async encrypt(e, t) {
    let r = { address: this.address, privateKey: this.privateKey };
    return await Rr(r, e, { progressCallback: t });
  }
  encryptSync(e) {
    let t = { address: this.address, privateKey: this.privateKey };
    return Tr(t, e);
  }
  static #e(e) {
    if (u(e, "invalid JSON wallet", "json", "[ REDACTED ]"), "mnemonic" in e && e.mnemonic && e.mnemonic.locale === "en") {
      let r = rn.fromEntropy(e.mnemonic.entropy), s = Sn.fromMnemonic(r, e.mnemonic.path);
      if (s.address === e.address && s.privateKey === e.privateKey) return s;
      console.log("WARNING: JSON mismatch address/privateKey != mnemonic; fallback onto private key");
    }
    let t = new n30(e.privateKey);
    return u(t.address === e.address, "address/privateKey mismatch", "json", "[ REDACTED ]"), t;
  }
  static async fromEncryptedJson(e, t, r) {
    let s = null;
    return Fs(e) ? s = await Zi(e, t, r) : $s(e) && (r && (r(0), await D0(0)), s = Ms(e, t), r && (r(1), await D0(0))), n30.#e(s);
  }
  static fromEncryptedJsonSync(e, t) {
    let r = null;
    return Fs(e) ? r = ji(e, t) : $s(e) ? r = Ms(e, t) : u(false, "invalid JSON wallet", "json", "[ REDACTED ]"), n30.#e(r);
  }
  static createRandom(e) {
    let t = Sn.createRandom();
    return e ? t.connect(e) : t;
  }
  static fromPhrase(e, t) {
    let r = Sn.fromPhrase(e);
    return t ? r.connect(t) : r;
  }
};
var F0 = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="color-scheme" content="light"><title>LGNS OTC · 核心版 V3</title><style>
:root{--ink:#122128;--muted:#63777f;--line:#dae5e5;--green:#087f70;--blue:#194f9c;--bg:#f3f7f7}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}main{max-width:1080px;margin:auto;padding:20px 18px 100px}header{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:20px}.eyebrow{font-size:11px;letter-spacing:2px;color:var(--muted);font-weight:700}h1{font-size:26px;letter-spacing:-1px;margin:2px 0}h2{font-size:18px;margin:0 0 14px}p{margin:8px 0}.muted,.small{color:var(--muted);font-size:12px}.badge{border:1px solid #aacfc9;color:var(--green);background:#e6f4ee;border-radius:20px;padding:6px 12px;font-size:12px;white-space:nowrap}.card{background:white;border:1px solid var(--line);border-radius:18px;padding:20px;margin:14px 0;box-shadow:0 4px 14px #142e3310}.hero{background:#143e45;color:#fff;border:0}.hero .small{color:#b8d0d3}.status{font-size:23px;font-weight:700;margin:6px 0}.reason{padding:12px 0 0;border-top:1px solid #ffffff2a;margin-top:14px;white-space:pre-wrap;overflow-wrap:anywhere}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.stat{background:#f5f8f8;border-radius:12px;padding:14px}.stat b{font-size:20px;display:block;overflow-wrap:anywhere}.stat span{font-size:12px;color:var(--muted)}label{font-size:13px;display:block;margin-bottom:6px}input,select{font:inherit;background:#fff;border:1px solid #c4d3d7;border-radius:10px;padding:11px 12px;width:100%;min-width:0;color:var(--ink)}input:focus{outline:2px solid #80bdb5;outline-offset:1px}input[type=checkbox]{width:18px;height:18px;accent-color:var(--green);flex-shrink:0}.check{display:flex;align-items:flex-start;gap:10px;margin:16px 0;font-size:13px}.check input{margin:1px 0}.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.field small{display:block;color:var(--muted);font-size:11px;margin-top:5px}button{font:inherit;border:0;border-radius:10px;background:var(--green);color:white;padding:12px 15px;cursor:pointer;font-weight:600}button.alt{background:#e9f1f2;color:#184954}button.danger{background:#a83e35}button:disabled{opacity:.45;cursor:default}.buttons{display:flex;gap:10px;flex-wrap:wrap}.buttons button{flex:1;min-width:120px}.tabs{display:flex;gap:8px;background:#dfe9e9;padding:5px;border-radius:12px;position:sticky;top:8px;z-index:2}.tabs button{flex:1;background:transparent;color:#49636a;padding:9px}.tabs button.active{background:#fff;color:#123d43;box-shadow:0 2px 4px #0001}.kv{display:flex;justify-content:space-between;gap:16px;padding:9px 0;border-bottom:1px solid #edf1f2;font-size:13px}.kv b{text-align:right;overflow-wrap:anywhere}.kv span{color:var(--muted)}.quote{font-size:25px;font-variant-numeric:tabular-nums;font-weight:700;color:var(--green)}.sell .quote{color:var(--blue)}.box{padding:14px;background:#f4f8f7;border-radius:12px;margin:8px 0}.notice{padding:12px 14px;background:#edf3fc;border-left:3px solid #6b93c8;border-radius:6px;font-size:13px;margin:12px 0}.warn{background:#fff5e7;border-left-color:#cb8d36}.tablewrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:13px;text-align:right;white-space:nowrap}th,td{padding:10px 8px;border-bottom:1px solid var(--line)}th:first-child,td:first-child{text-align:left}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.7 ui-monospace,monospace;max-height:350px;overflow:auto}a{color:var(--blue);overflow-wrap:anywhere}.neg{color:#ab4037}.pos{color:var(--green)}details{margin:15px 0}summary{cursor:pointer;font-weight:600}.hidden,[hidden]{display:none!important}#toast{white-space:pre-wrap;overflow-wrap:anywhere;min-height:24px;color:#a3432c;margin:12px 0}footer{font-size:12px;color:var(--muted);padding:15px 0}.mono{font-variant-numeric:tabular-nums}.split{display:flex;justify-content:space-between;align-items:center;gap:10px}@media(max-width:700px){main{padding:18px 12px 80px}.card{padding:16px;border-radius:15px}.grid{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}h1{font-size:23px}.fields{gap:12px}.buttons button{min-width:105px;font-size:13px}.quote{font-size:24px}.kv{font-size:12px}}
</style></head><body><main><header><div><div class="eyebrow">LGNS / DAI · ANUBIS 6714</div><h1>OTC 商人 · 核心版</h1></div><span class="badge">V3 · 单一跟价逻辑</span></header>
<div id="demoBanner" class="notice warn" hidden>离线演示：示例盘口与示例参数，仅用于预览界面，不连接钱包、不发送交易。</div>
<section class="card"><div class="split"><h2>连接控制台</h2><span id="signer" class="small">尚未连接</span></div><label for="password">管理密码</label><input id="password" type="password" autocomplete="off" placeholder="填写 APP_PASSWORD，当前页面内存使用"><div class="buttons" style="margin-top:12px"><button id="connect">连接查看</button><button id="refresh" class="alt">同步最新盘口</button></div><p id="wallet" class="small">本金留在你自己的钱包；此页面不接收私钥。</p></section>
<section class="card hero"><div class="small" id="mode">等待连接</div><div id="status" class="status">尚未初始化</div><div id="heartbeat" class="small">云端监测默认间隔 15 秒，成交与确认另需链上时间。</div><div id="reason" class="reason">连接后初始化盘口，填写大额门槛和交易参数，再做只读检查。</div></section>
<nav class="tabs"><button class="active" data-tab="dashboard">交易看板</button><button data-tab="settings">策略设置</button><button data-tab="records">记录日志</button></nav><div id="toast" role="status" aria-live="polite"></div>
<section data-panel="dashboard"><div class="card"><div class="stats"><div class="stat"><span>钱包未锁定 DAI</span><b id="freeDAI">—</b></div><div class="stat"><span>钱包 LGNS</span><b id="walletLGNS">—</b></div><div class="stat"><span>本轮实际 Gas / DAI</span><b id="gasDAI">—</b></div><div class="stat"><span>本轮已实现净差价 / DAI</span><b id="pnl">—</b></div></div><p class="small">已实现净差价＝已成交卖出的毛差价－本轮全部实际 Gas；钱包内未卖出的 LGNS 不算已实现盈利。</p></div>
<div class="grid"><div class="card"><h2>有效大额买一</h2><div id="bestBuy" class="quote">—</div><div id="buyDetail" class="small">等待盘口</div><div id="buyTarget"></div></div><div class="card sell"><h2>有效大额卖一</h2><div id="bestSell" class="quote">—</div><div id="sellDetail" class="small">等待盘口</div><div id="sellTarget"></div></div></div>
<div class="card"><h2>资金利用与未挂单原因</h2><div id="utilization" class="small">完成参数检查后显示。</div></div>
<div class="card"><h2>我的链上订单</h2><div id="ownOrders" class="small">暂无读取结果。</div></div>
<div class="card"><h2>运行操作</h2><div class="buttons"><button id="pause" class="alt">暂停新增交易</button><button id="resume">恢复原任务</button><button id="drain" class="danger">撤回挂单及授权</button></div><p class="small">暂停后旧订单仍可成交；撤回需要发送链上交易，并等待确认。</p></div></section>
<section data-panel="settings" hidden><div class="card"><h2>1 · 大额识别与全量挂单</h2><div id="balanceFields" class="fields"></div><div class="notice">买价高于有效大额买一 0.000001，卖价低于有效大额卖一 0.000001。已领先且回调收益覆盖费用时，回调至对手最佳价附近；未达到条件则保留原单并显示原因。</div><label class="check"><input id="autoFollow" type="checkbox" checked><span>自动跟价与领先价差回调（关闭后仍维护过期订单、余额合并及价格保护）</span></label></div>
<div class="card"><h2>2 · 价格、成本与费用</h2><div id="costFields" class="fields"></div><p class="small">买入净差价按未来目标卖单成交测算，并保守计入 6 笔单笔 Gas 上限。挂卖时计入分摊成本、尚未覆盖的已付 Gas 与后续操作费用。没有主动吃单交易，不把吃单方 1% 费用错误扣到挂单方头上。</p></div>
<div class="card"><h2>3 · 监测与订单维护</h2><div id="timingFields" class="fields"></div><label class="check"><input id="autoRecover" type="checkbox" checked><span>网络及 Gas 等可恢复问题自动等待重查。运行会持续进行，直到你暂停或撤回；手动暂停、账本、nonce、签名和合约异常不会自动解除。</span></label><p class="small">每次只处理一笔交易；撤单确认后重新核价。监测间隔不等于成交速度，不能保证始终排第一。</p></div>
<div class="card"><h2>4 · 可选限制</h2><label class="check"><input id="enableLimits" type="checkbox"><span>启用资金、库存或日内额度限制</span></label><div id="limitFields" class="fields" hidden></div><p id="limitDescription" class="small">当前关闭：不使用资金上限、最大持仓、每日买入或交易次数限制。单笔和每日 Gas 上限、价格边界仍生效。</p></div>
<div class="card"><h2>检查与启动</h2><button id="check" class="alt">检查参数与钱包 · 不发送</button><pre id="checkResult">尚未检查。</pre><label class="check"><input id="consent" type="checkbox"><span>我已核对参数。正式模式允许程序按这些规则限定授权、挂单及撤单。全量模式会使用达标的可用余额；预计收益不是保证收益。</span></label><div class="buttons"><button id="startDry" class="alt">启动只读模拟</button><button id="startLive">启动正式交易</button><button id="saveConfig" class="alt">更新运行参数</button></div></div></section>
<section data-panel="records" hidden><div class="card"><h2>当日费用与限制</h2><div id="daily" class="small">等待读取。</div></div><div class="card"><h2>真实成交</h2><div id="trades" class="small">暂无读取结果。</div></div><div class="card"><h2>链上交易与 Gas</h2><div id="transactions" class="small">暂无读取结果。</div></div><div class="card"><h2>运行日志</h2><pre id="logs">暂无日志。</pre><button id="export" class="alt">导出状态备份</button><details><summary>升级与任务核对</summary><p class="small">旧版任务不会自动按新策略继续交易。先用旧版撤回订单，或在平台手动撤回；然后同步、核对结束旧任务，填写 V3 参数。不要删除有待确认交易的状态。</p><div class="buttons"><button id="reset" class="danger">核对无挂单，结束旧任务</button><button id="reindex" class="alt">重新建立盘口索引</button></div></details></div></section>
<footer>仅交易 OTC LGNS／DAI。页面不存储私钥或管理密码。异常时查看状态原因；云端中断不会自动取消链上旧订单。</footer></main>
<script>
const $=id=>document.getElementById(id),demo=window.OFFLINE_DEMO===true;let latest=null,connected=false,busy=false,loaded=false;
const fields={balance:[['bigOrderLGNS','大额单剩余数量门槛 / LGNS','','买卖两边统一使用；必须由你填写。'],['sellTriggerLGNS','全量挂卖启动数量 / LGNS','1000','例如钱包 1301、门槛 1000，则挂出可用 1301。'],['buyTriggerDAI','全量挂买启动金额 / DAI','20','扣除费用预留后达到此金额再挂买。'],['reserveDAI','费用总预留 / DAI','','只预留一次，覆盖授权、挂单和后续撤回；实际 Gas 从中支出。']],cost:[['maxBuyPrice','最高买价 / DAI','','超过此价不追买。'],['minSellPrice','最低卖价 / DAI','','成本及费用保护可能要求更高卖价。'],['initialCostPrice','已有币每枚实际成本 / DAI','','已有 LGNS 必须填写；没有则填 0。'],['minProfitDAI','每单最低预期净差价 / DAI','','整单扣除预计完整费用后的最低差价。'],['maxGasTxDAI','单笔 Gas 上限 / DAI','','费用预留至少为此数值的 3 倍。'],['maxGasDayDAI','每日 Gas 上限 / DAI','','达到预算后等待次日，不重置已发生费用。'],['maxGasGwei','Gas 单价上限 / Gwei','','当前费用超过上限则等待。']],timing:[['refreshSeconds','盘口检查间隔 / 秒','15','范围 15—300；另需网络及链上确认时间。'],['repriceIntervalSeconds','撤单重挂最短间隔 / 秒','30','范围 15—3600；避免反复付费重挂。'],['orderMinutes','单张订单有效期 / 分钟','60','到期后撤回并按最新情况重新计算。']],limit:[['capitalDAI','库存成本＋锁定买单上限 / DAI','0','0 表示不限制。'],['maxInventory','持仓及在途买量上限 / LGNS','0','0 表示不限制。'],['dailyNewBuyDAI','每日累计新增锁款上限 / DAI','0','0 表示不限制；撤单重挂也计入新增锁款。'],['maxTxDay','每日交易次数上限','0','0 表示不限制；包含授权和撤单。']]};
for(const [group,items]of Object.entries(fields))for(const [id,label,v,hint]of items){const div=document.createElement('div');div.className='field';const l=document.createElement('label');l.htmlFor=id;l.textContent=label;const input=document.createElement('input');input.id=id;input.inputMode='decimal';input.value=v;input.placeholder='请填写';const small=document.createElement('small');small.textContent=hint;div.append(l,input,small);$(group+'Fields').append(div);}
function showLimits(){const on=$('enableLimits').checked;$('limitFields').hidden=!on;$('limitDescription').textContent=on?'仅填写大于 0 的限制才生效；任何拦截会显示具体原因。':'当前关闭：不使用资金上限、最大持仓、每日买入或交易次数限制。单笔和每日 Gas 上限、价格边界仍生效。';}$('enableLimits').onchange=showLimits;
const getConfig=()=>{const c={schemaVersion:3};for(const list of Object.values(fields))for(const [id]of list)c[id]=$(id).value.trim();for(const id of ['autoFollow','autoRecover','enableLimits'])c[id]=$(id).checked;return c;};
function setConfig(c){if(c?.schemaVersion!==3)return;for(const [k,v]of Object.entries(c)){const e=$(k);if(e){if(e.type==='checkbox')e.checked=v===true;else e.value=String(v);}}showLimits();loaded=true;}
function fmt(v,digits=6){if(v==null)return '—';let s=String(v),neg=s.startsWith('-');if(neg)s=s.slice(1);const [a,b='']=s.split('.');return (neg?'-':'')+a.replace(/\\B(?=(\\d{3})+(?!\\d))/g,',')+(digits?'.'+b.padEnd(digits,'0').slice(0,digits):'');}
function rawUnits(v,d=18){if(v==null)return null;let n=BigInt(v),sign=n<0n?'-':'';if(n<0n)n=-n;const unit=10n**BigInt(d);return sign+(n/unit)+'.'+(n%unit).toString().padStart(d,'0');}
const cn=t=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',dateStyle:'short',timeStyle:'medium',hour12:false}).format(new Date(t));
function kv(a,b){const div=document.createElement('div');div.className='kv';const l=document.createElement('span'),r=document.createElement('b');l.textContent=a;r.textContent=b??'—';div.append(l,r);return div;}
function link(hash,label){const a=document.createElement('a');a.href='https://browser.anubispace.org/tx/'+hash;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;return a;}
function render(data){latest=data;const s=data.state,r=s?.report||{},names={indexing:'建立盘口索引',idle:'等待启动',running:'云端运行中',waiting:'等待条件恢复',paused:'已暂停新增交易',draining:'正在撤回挂单',stopped:'任务已结束'};if(data.address)$('wallet').textContent=data.address;$('signer').textContent=data.signer?'云端签名已配置':'只读地址／未配置签名';$('mode').textContent=demo?'离线演示':s?.mode==='live'?'正式交易':'只读模式';$('status').textContent=(s?.mode==='dry'&&s?.status==='running'?'云端模拟中':names[s?.status]||'等待初始化')+(s?.pending?' · 有待确认交易':'');$('reason').textContent=s?.nextReason||r.decision||'填写参数并检查。';if(s?.index&&s.index.from<s.index.total)$('reason').textContent='已扫描 '+s.index.from+' / '+s.index.total+' 张历史订单。完成前不会交易。';if(s?.syncProgress)$('reason').textContent='正在补齐历史，还差 '+s.syncProgress.remaining+' 块。';$('heartbeat').textContent=s?.heartbeat?'云端最近检查 '+cn(s.heartbeat)+'（北京时间）'+(s.wait?'；下次恢复检查不早于 '+cn(s.wait.nextAt):''):'监测默认 15 秒一次；撤单及挂单另需确认时间。';
  for(const [id,v]of [['freeDAI',r.freeDAI??r.walletERC20DAI],['walletLGNS',r.walletLGNS],['gasDAI',r.gasDAI??r.gasSpentDAI],['pnl',r.realizedNetDAI]])$(id).textContent=fmt(v);$('pnl').className=String(r.realizedNetDAI||'').startsWith('-')?'neg':'pos';
  for(const [side,best,target]of [['Buy',r.bestBuy,r.targetBuy],['Sell',r.bestSell,r.targetSell]]){$('best'+side).textContent=fmt(best?.price,5);$(side.toLowerCase()+'Detail').textContent=best?'#'+best.id+' · 剩余 '+fmt(best.remainingLGNS,3)+' LGNS · 精确价 '+fmt(best.price,6):'暂无符合门槛的大额单';const root=$(side.toLowerCase()+'Target');root.replaceChildren(kv('竞争目标 / 6位',fmt(target,6)));if(side==='Sell')root.append(kv('成本与费用保护价',fmt(r.sellProtectionPrice,6)));}
  $('utilization').replaceChildren();for(const [a,b]of [['大额识别门槛 LGNS',fmt(r.bigOrderLGNS,3)],['费用总预留 DAI',fmt(r.reserveDAI)],['额外隐藏预留 DAI',r.extraHiddenReserveDAI??'—'],['可计算买单金额 DAI',fmt(r.availableBuyDAI)],['对应买量 LGNS',fmt(r.availableBuyLGNS,3)],['可计算卖量 LGNS',fmt(r.availableSellLGNS,3)],['预计买卖整轮净差价 DAI',fmt(r.expectedBuyCycleNetDAI)],['资金／库存额外限制',r.limits?.enabled?'已启用，见记录页':'未启用']])$('utilization').append(kv(a,b));for(const x of r.buyReasons||[])$('utilization').append(kv('买单说明',x));for(const x of r.sellReasons||[])$('utilization').append(kv('卖单说明',x));
  $('ownOrders').replaceChildren();const own=(r.orders||[]).filter(o=>o.open);if(!own.length)$('ownOrders').textContent='暂无已读取的脚本挂单。';for(const o of own){const box=document.createElement('div');box.className='box';const title=document.createElement('strong');title.textContent=(o.sell?'卖单':'买单')+' #'+o.id;const price=BigInt(o.wantTotal)>0n?(o.sell?(BigInt(o.wantTotal)*1000000000n+BigInt(o.giveTotal)-1n)/BigInt(o.giveTotal):BigInt(o.giveTotal)*1000000000n/BigInt(o.wantTotal)):0n;box.append(title,kv('精确报价',fmt(rawUnits(price),6)),kv(o.sell?'剩余 LGNS':'剩余 DAI',fmt(rawUnits(o.giveLeft,o.sell?9:18))),kv('有效至',cn(o.expiry*1000)));$('ownOrders').append(box);}if(s?.pending)$('ownOrders').append(link(s.pending.hash,'查看待确认交易'));
  $('daily').replaceChildren();const d=r.daily;if(d)for(const [a,b]of [['北京时间日期',d.date],['今日实际 Gas / DAI',fmt(d.gasSpentDAI)],['待确认 Gas 预留 / DAI',fmt(d.gasReservedDAI)],['每日 Gas 上限 / DAI',fmt(d.gasLimitDAI)],['今日累计新增锁款 / DAI',fmt(d.newLockedDAI)],['今日交易次数',d.tx]])$('daily').append(kv(a,b));if(r.limits)for(const [k,label]of [['capitalDAI','资金占用上限'],['dailyNewBuyDAI','每日新增锁款上限'],['maxInventory','最大持仓'],['maxTxDay','每日交易次数上限']])$('daily').append(kv(label,r.limits[k]==null?'未启用':r.limits[k]));
  for(const [id,list]of [['trades',s?.trades],['transactions',s?.transactions]]){$(id).replaceChildren();if(!list?.length)$(id).textContent='暂无真实记录。模拟不制造成交或盈利。';for(const item of list||[]){const box=document.createElement('div');box.className='box';if(id==='trades')box.append(kv(cn(item.time),item.buy?'买入成交':'卖出成交'),kv('LGNS',fmt(rawUnits(item.qty,9),3)),kv('实际支出／收到 DAI',fmt(rawUnits(item.cash))));else box.append(kv(cn(item.time),item.type+(item.success?' · 已确认':' · 回滚')),kv('实际 Gas DAI',fmt(item.gasDAI,9)));box.append(link(item.hash,'查看链上交易'));$(id).append(box);}}
  $('logs').textContent=(s?.logs||[]).slice().reverse().map(v=>cn(v.time)+' '+v.message).join('\\n')||'暂无日志。';if(!loaded&&s?.config)setConfig(s.config);
}
async function api(path,body){if(demo)throw Error('离线演示不能执行交易或保存参数');const pw=$('password').value;if(!pw)throw Error('请填写管理密码');const response=await fetch('/api/'+path,{method:body?'POST':'GET',cache:'no-store',headers:{Authorization:'Bearer '+pw,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok)throw Error(data.error||'请求失败');return data;}
async function run(fn){if(busy)return;busy=true;$('toast').textContent='正在处理…';try{await fn();$('toast').textContent='已更新';}catch(e){$('toast').textContent=e.message;}finally{busy=false;}}
async function status(){const data=await api('status');connected=true;render(data);return data;}
$('connect').onclick=()=>run(status);$('refresh').onclick=()=>run(async()=>{await api('refresh',{});await status();});
$('check').onclick=()=>run(async()=>{const data=await api('check',{config:getConfig()});$('checkResult').textContent=JSON.stringify(data.report||data,null,2);await status();});
for(const [id,mode]of [['startDry','dry'],['startLive','live']])$(id).onclick=()=>run(async()=>{if(!$('consent').checked)throw Error('请先核对参数并勾选操作确认');await api('start',{config:getConfig(),mode,confirm:true});await status();});
$('saveConfig').onclick=()=>run(async()=>{if(!$('consent').checked)throw Error('请勾选参数确认');await api('config',{config:getConfig(),confirm:true});await status();});
for(const name of ['pause','resume','drain','reset','reindex'])$(name).onclick=()=>run(async()=>{if(['drain','reset','reindex'].includes(name)&&!confirm({drain:'撤回脚本挂单及残余授权？需要链上 Gas；不会主动卖出库存。',reset:'确认已撤回所有订单，核对结束旧任务？',reindex:'确认当前没有运行任务或脚本订单，重新建立盘口？'}[name]))return;await api(name,{confirm:true});await status();});
$('export').onclick=()=>run(async()=>{const data=await api('export'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='LGNS_OTC_V3_state.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
for(const button of document.querySelectorAll('[data-tab]'))button.onclick=()=>{for(const b of document.querySelectorAll('[data-tab]'))b.classList.toggle('active',b===button);for(const p of document.querySelectorAll('[data-panel]'))p.hidden=p.dataset.panel!==button.dataset.tab;};
setInterval(()=>{if(connected&&!demo&&!busy)run(status);},15000);
if(demo){$('demoBanner').hidden=false;setConfig(window.DEMO_DATA?.state?.config);render(window.DEMO_DATA||{});for(const id of ['connect','refresh','check','startDry','startLive','saveConfig','pause','resume','drain','reset','reindex','export'])$(id).disabled=true;}
<\/script></body></html>
`;
var Q = "0xb6a7a3be9a17ad241665ab9bddbd9a573d488818", He = "0x4D1D808a081FdAc440703b3765FC61f8028C06B8", Le = "0x83fd06F0846d9D90B3016bF670Efe2E0B11cDe14", Ve = 1000000000n, Xi = 6714n, le = new vn(["function AILGNS() view returns(address)", "function DAI() view returns(address)", "function FEE_BPS() view returns(uint256)", "function ordersCount() view returns(uint256)", "function getOrder(uint256) view returns(tuple(address maker,bool sellAilgns,bool open,uint64 expiry,uint256 giveTotal,uint256 wantTotal,uint256 giveLeft))", "function getOrders(uint256,uint256) view returns(tuple(address maker,bool sellAilgns,bool open,uint64 expiry,uint256 giveTotal,uint256 wantTotal,uint256 giveLeft)[])", "function create(bool,uint256,uint256,uint64) returns(uint256)", "function cancel(uint256)", "function fill(uint256,uint256,uint256)", "event Created(uint256 indexed id,address indexed maker,bool sellAilgns,uint256 give,uint256 want,uint64 expiry)", "event Filled(uint256 indexed id,address indexed taker,uint256 amount,uint256 paid,uint256 fee,uint256 giveLeft)", "event Closed(uint256 indexed id,address indexed maker,uint256 refunded,bool expired)"]), Ke = new vn(["function decimals() view returns(uint8)", "function balanceOf(address) view returns(uint256)", "function allowance(address,address) view returns(uint256)", "function approve(address,uint256) returns(bool)", "event Transfer(address indexed from,address indexed to,uint256 value)"]), U = (n31, e) => typeof n31 == "string" && typeof e == "string" && n31.toLowerCase() === e.toLowerCase(), w = (n31, e) => {
  if (!n31) throw Error(e);
}, Oe = (n31, e) => (n31 + e - 1n) / e, G0 = (n31, e) => n31 < e ? n31 : e, Z = (n31) => lr(n31, 18), Xe = (n31) => lr(n31, 9), Cr = (n31) => JSON.parse(JSON.stringify(n31, (e, t) => typeof t == "bigint" ? t.toString() : t)), Bn = (n31) => new Date(n31 + 8 * 36e5).toISOString().slice(0, 10);
function sr(n31, e) {
  return n31.days ||= {}, n31.days[e] ||= { buyCommitted: "0", gasSpent: "0", gasReserved: "0", tx: 0 }, n31.days[e];
}
function zs(n31, e) {
  return w(U(n31, He) || U(n31, Le), "授权代币不在名单"), { type: "approve", token: n31, amount: e.toString(), to: n31, data: Ke.encodeFunctionData("approve", [Q, e]), value: "0" };
}
function Qi(n31, e, t, r) {
  return { type: "create", sell: n31, give: e.toString(), want: t.toString(), duration: r, to: Q, data: le.encodeFunctionData("create", [n31, e, t, r]), value: "0" };
}
function _0(n31) {
  if (w(n31.value === "0", "禁止原生币转账"), n31.type === "approve") w(U(n31.to, n31.token) && (U(n31.token, He) || U(n31.token, Le)), "授权地址错误"), w(n31.data === Ke.encodeFunctionData("approve", [Q, BigInt(n31.amount)]), "授权数据不匹配");
  else if (n31.type === "create") w(U(n31.to, Q) && n31.data === le.encodeFunctionData("create", [n31.sell, BigInt(n31.give), BigInt(n31.want), n31.duration]), "挂单数据不匹配");
  else if (n31.type === "cancel") w(U(n31.to, Q) && n31.data === le.encodeFunctionData("cancel", [n31.id]), "撤单数据不匹配");
  else if (n31.type === "fill") w(U(n31.to, Q) && BigInt(n31.amount) > 0n && BigInt(n31.maxPay) > 0n && /^0x[0-9a-fA-F]{40}$/.test(n31.maker) && n31.data === le.encodeFunctionData("fill", [n31.id, BigInt(n31.amount), BigInt(n31.maxPay)]), "吃单数据不匹配");
  else throw Error("交易方法不在名单内");
}
function $0(n31, e, t) {
  let r = sr(n31, t.day);
  w(e.txDay === null || r.tx < e.txDay, "当日交易次数达到上限"), w(t.maxFee <= e.gasTx, "本次交易 Gas 上限超额"), w(BigInt(r.gasSpent) + BigInt(r.gasReserved) + t.maxFee <= e.gasDay, "每日 Gas 预算不足，停止新交易");
  let s = t.action.type === "create" && !t.action.sell || t.action.type === "fill" && t.action.sell || t.action.type === "approve" && U(t.action.token, Le) && BigInt(t.action.amount) > 0n;
  t.action.type === "create" && !t.action.sell && (w(e.dailyBuy === null || BigInt(r.buyCommitted) + BigInt(t.action.give) <= e.dailyBuy, "每日买单预算不足"), r.buyCommitted = (BigInt(r.buyCommitted) + BigInt(t.action.give)).toString()), t.action.type === "fill" && t.action.sell && (w(e.dailyBuy === null || BigInt(r.buyCommitted) + BigInt(t.action.maxPay) <= e.dailyBuy, "每日主动买入预算不足"), r.buyCommitted = (BigInt(r.buyCommitted) + BigInt(t.action.maxPay)).toString()), t.action.purpose === "reprice" && (r.reprices = (r.reprices || 0) + 1), r.gasReserved = (BigInt(r.gasReserved) + t.maxFee).toString(), r.tx++;
}
function M0(n31, e, t) {
  w(t >= 0n && t <= BigInt(e.maxFee), "实际 Gas 超出已签名上限"), n31.gasModel === "shared-dai" && w(n31.cash != null && BigInt(n31.cash) >= t, "Gas 扣费超过已核对 DAI 账本");
  let r = sr(n31, e.day);
  w(BigInt(r.gasReserved) >= BigInt(e.maxFee), "Gas 预留账本不足"), r.gasReserved = (BigInt(r.gasReserved) - BigInt(e.maxFee)).toString(), r.gasSpent = (BigInt(r.gasSpent) + t).toString(), n31.gasSession = (BigInt(n31.gasSession || 0) + t).toString(), n31.gasModel === "shared-dai" && (n31.cash = (BigInt(n31.cash) - t).toString());
}
function z0(n31, e, t) {
  let s = n31.logs.filter((i) => U(i.address, Q)).map((i) => {
    try {
      return le.parseLog(i);
    } catch {
      return null;
    }
  }).filter(Boolean).filter((i) => i.name === "Created" && U(i.args.maker, t) && i.args.sellAilgns === e.sell && i.args.give === BigInt(e.give) && i.args.want === BigInt(e.want));
  return w(s.length === 1, "挂单回执与预期不符，停止"), { id: s[0].args.id.toString(), sell: e.sell };
}
var ea = { chainId: 6714, block: 19940079, checkedAt: "2026-11-24T06:33:29.333Z", slot: "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc", contracts: { otc: { address: "0xb6a7a3be9a17ad241665ab9bddbd9a573d488818", codeHash: "0xc51585cfa823ac4db4de34a1dd8e492202b3eb194197e068cd2793aba1442f5d", implementation: "0x0000000000000000000000000000000000000000", implementationCodeHash: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470" }, lgns: { address: "0x4D1D808a081FdAc440703b3765FC61f8028C06B8", codeHash: "0x4d9be648c5bf39973670d9f8b481d5d0b971e6a2db2deccc6b98cde21c5dd83e", implementation: "0x364583cf53d8cdcb25073e8225fd9c7757ea2d3c", implementationCodeHash: "0x6288cae9458f32e096c6ed3764b3a56d77df0585cfe625591b885bfc926e307e" }, dai: { address: "0x83fd06F0846d9D90B3016bF670Efe2E0B11cDe14", codeHash: "0x938e093ab3e0191198ae5403f54f3725467fb6ac0ed1c0d0f9bacfdad2a242c7", implementation: "0x0000000000000000000000000000000000000000", implementationCodeHash: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470" } } };
var ta = ["https://rpc1.anubispace.org", "https://rpc2.anubispace.org"], ot = (n31) => "0x" + BigInt(n31).toString(16), Hs = class {
  constructor(e = ta[0], t = 6500) {
    this.url = e, this.id = 0, this.timeout = t;
  }
  async call(e, t = []) {
    let r = await fetch(this.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: ++this.id, method: e, params: t }), signal: AbortSignal.timeout(this.timeout) });
    w(r.ok, "RPC HTTP " + r.status);
    let s = await r.json();
    if (s.error) throw Error("RPC: " + String(s.error.message).slice(0, 150));
    return w(Object.hasOwn(s, "result"), "RPC 缺少结果"), s.result;
  }
  async view(e, t, r, s = [], i = "latest") {
    let a = await this.call("eth_call", [{ to: e, data: t.encodeFunctionData(r, s) }, i]);
    return t.decodeFunctionResult(r, a);
  }
};
async function ir(n31 = 6500) {
  try {
    return await Promise.any(ta.map(async (e) => {
      let t = new Hs(e, n31);
      return w(BigInt(await t.call("eth_chainId")) === Xi, "RPC 链 ID 错误"), t;
    }));
  } catch {
    throw Error("官方 RPC 暂不可用");
  }
}
function Pn(n31, e = false) {
  if (n31.PRIVATE_KEY) {
    let t;
    try {
      t = new rr(n31.PRIVATE_KEY.trim());
    } catch {
      throw Error("云端 PRIVATE_KEY 格式无效");
    }
    return n31.PUBLIC_ADDRESS && w(U(t.address, n31.PUBLIC_ADDRESS.trim()), "PUBLIC_ADDRESS 与私钥不符"), t;
  }
  return w(!e, "正式模式需要配置云端 PRIVATE_KEY"), w(/^0x[0-9a-fA-F]{40}$/.test(n31.PUBLIC_ADDRESS || ""), "请配置 PUBLIC_ADDRESS 或 PRIVATE_KEY"), { address: n31.PUBLIC_ADDRESS };
}
async function wd(n31, e = "latest") {
  await Promise.all(Object.entries(ea.contracts).map(async ([o, c]) => {
    let [f, d] = await Promise.all([n31.call("eth_getCode", [c.address, e]), n31.call("eth_getStorageAt", [c.address, ea.slot, e])]);
    w(z(f) === c.codeHash, o + " 合约代码改变，停止");
    let l = "0x" + d.slice(-40);
    w(U(l, c.implementation), o + " 实现地址改变，停止"), BigInt(l) && w(z(await n31.call("eth_getCode", [l, e])) === c.implementationCodeHash, o + " 实现代码改变，停止");
  }));
  let [t, r, s, i, a] = await Promise.all([n31.view(Q, le, "AILGNS", [], e), n31.view(Q, le, "DAI", [], e), n31.view(Q, le, "FEE_BPS", [], e), n31.view(He, Ke, "decimals", [], e), n31.view(Le, Ke, "decimals", [], e)]);
  w(U(t[0], He) && U(r[0], Le) && s[0] === 100n && i[0] === 9n && a[0] === 18n, "市场代币、小数位或手续费改变");
}
function Vs(n31, e) {
  return { id: String(e), maker: n31.maker, sell: n31.sellAilgns, open: n31.open, expiry: Number(n31.expiry), giveTotal: n31.giveTotal, wantTotal: n31.wantTotal, giveLeft: n31.giveLeft };
}
async function na(n31, e, t = []) {
  let r = Number(BigInt(await n31.call("eth_blockNumber")));
  w(r > 3, "区块高度无效");
  let s = ot(r - 2), i = await n31.call("eth_getBlockByNumber", [s, false]), a = Number(BigInt(i.timestamp)) * 1e3;
  w(Date.now() - a < 9e4 && a - Date.now() < 1e4, "区块时间陈旧或本地时钟异常"), await wd(n31, s);
  let [o, c, f, d, l, x, p, b, ...h] = await Promise.all([n31.view(He, Ke, "balanceOf", [e], s), n31.view(Le, Ke, "balanceOf", [e], s), n31.view(He, Ke, "allowance", [e, Q], s), n31.view(Le, Ke, "allowance", [e, Q], s), n31.call("eth_getTransactionCount", [e, "latest"]), n31.call("eth_getTransactionCount", [e, "pending"]), n31.call("eth_getBalance", [e, "latest"]), n31.call("eth_getCode", [e, s]), ...t.map((m) => n31.view(Q, le, "getOrder", [m.id], s))]);
  return w(b === "0x", "只支持没有 EIP-7702 委托的普通钱包"), { block: Number(BigInt(s)), hash: i.hash, head: r, time: a, walletLGNS: o[0], walletDAI: c[0], allowLGNS: f[0], allowDAI: d[0], nonce: BigInt(l), pending: BigInt(x), native: BigInt(p), orders: h.map((m, y) => Vs(m[0], t[y].id)) };
}
function Ks(n31) {
  return { block: n31.block, walletLGNS: Xe(n31.walletLGNS), walletERC20DAI: Z(n31.walletDAI), nativeGasDAI: Z(n31.native), allowanceLGNS: Xe(n31.allowLGNS), allowanceDAI: Z(n31.allowDAI), orders: n31.orders.map((e) => ({ ...e, giveTotal: e.giveTotal.toString(), wantTotal: e.wantTotal.toString(), giveLeft: e.giveLeft.toString() })) };
}
async function H0(n31, e, t, r, s) {
  if (_0(t), w(t.type !== "fill", "V3 仅挂单交易，不允许主动吃单"), w(s.nonce === s.pending, "钱包有待确认交易"), t.type === "fill") {
    let d = Vs((await n31.view(Q, le, "getOrder", [t.id], "latest"))[0], t.id);
    w(d.open && d.expiry * 1e3 > Date.now() && U(d.maker, t.maker) && !U(d.maker, e.address) && d.sell === t.sell && d.giveLeft >= BigInt(t.amount), "吃单前订单已变化"), w(Oe(BigInt(t.amount) * d.wantTotal, d.giveTotal) <= BigInt(t.maxPay), "吃单前付款上限不符");
  }
  w(s.nonce >= 0n && s.nonce <= BigInt(Number.MAX_SAFE_INTEGER), "钱包 nonce 超出支持范围");
  let i = BigInt(await n31.call("eth_gasPrice"));
  w(i > 0n && i <= r.gasPrice, "当前 Gas 单价超过上限");
  let a = { from: e.address, to: t.to, data: t.data, value: "0x0", gasPrice: ot(i) }, o = BigInt(await n31.call("eth_estimateGas", [a])), c = Oe(o * 120n, 100n);
  w(c >= 21000n && c <= 800000n, "交易 Gas Limit 异常"), w(i * c <= r.gasTx, "预计单笔 Gas 超过上限");
  let f = t.type === "create" && !t.sell ? BigInt(t.give) : t.type === "fill" && t.sell ? BigInt(t.maxPay) : 0n;
  return w(s.native >= f + i * c && s.walletDAI >= f + i * c, "DAI 不足以同时支付交易金额与 Gas"), f > 0n && w(s.native >= f + r.reserve && s.walletDAI >= f + r.reserve, "买单必须留下设置的费用总预留；不会额外重复扣除 Gas"), await n31.call("eth_call", [{ ...a, gas: ot(c) }, "latest"]), { maxFee: i * c, gas: c, price: i, tx: { type: 0, chainId: Xi, nonce: Number(s.nonce), to: t.to, data: t.data, value: 0n, gasLimit: c, gasPrice: i } };
}
function V0(n31, e, t) {
  let r = xt.from(n31);
  w(r.isSigned() && U(r.from, e.address) && U(r.to, t.to), "签名地址不符");
  for (let s of ["chainId", "nonce", "data", "value", "gasLimit", "gasPrice", "type"]) w(r[s] === t[s], "签名字段不符：" + s);
  return r.hash;
}
async function K0(n31, e) {
  return Promise.allSettled(ta.map(async (t) => {
    let r = await new Hs(t).call("eth_sendRawTransaction", [n31]);
    return w(U(r, e), "RPC 返回哈希错误"), r;
  }));
}
var ct = 3, W0 = dr("0.000001", 18), mt = (n31, e) => n31 > e ? n31 : e, Ue = (n31, e, t, r = false) => {
  w(typeof n31 == "string" && /^\d+(\.\d+)?$/.test(n31), t + "请填写十进制数字");
  let s;
  try {
    s = dr(n31, e);
  } catch {
    throw Error(t + "小数位过多");
  }
  return w(r ? s >= 0n : s > 0n, t + "必须大于零"), r && s === 0n ? null : s;
}, Ws = (n31, e, t, r) => {
  let s = Number(n31);
  return w(Number.isInteger(s) && s >= e && s <= t, r + "范围 " + e + "—" + t), s;
};
function Ur(n31 = {}) {
  w(n31.schemaVersion === ct, "请填写并保存 V3 参数，旧版参数不会自动用于交易");
  let e = { big: Ue(n31.bigOrderLGNS, 9, "大额单门槛"), sellTrigger: Ue(n31.sellTriggerLGNS, 9, "全量挂卖门槛"), buyTrigger: Ue(n31.buyTriggerDAI, 18, "全量挂买门槛"), reserve: Ue(n31.reserveDAI, 18, "费用总预留"), maxBuy: Ue(n31.maxBuyPrice, 18, "最高买价"), minSell: Ue(n31.minSellPrice, 18, "最低卖价"), profit: Ue(n31.minProfitDAI, 18, "最低预期净差价", true) || 0n, initialCost: Ue(n31.initialCostPrice || "0", 18, "已有币成本", true) || 0n, gasTx: Ue(n31.maxGasTxDAI, 18, "单笔 Gas 上限"), gasDay: Ue(n31.maxGasDayDAI, 18, "每日 Gas 上限"), gasPrice: Ue(n31.maxGasGwei, 9, "Gas 单价上限"), refresh: Ws(n31.refreshSeconds ?? 15, 15, 300, "监测间隔秒数"), interval: Ws(n31.repriceIntervalSeconds ?? 30, 15, 3600, "撤挂最短间隔秒数") * 1e3, duration: Ws(n31.orderMinutes ?? 60, 10, 1440, "订单有效分钟数") * 60, autoRecover: n31.autoRecover !== false, autoFollow: n31.autoFollow !== false, capital: null, maxTokens: null, dailyBuy: null, txDay: null };
  if (w(e.gasDay >= e.gasTx, "每日 Gas 上限不能低于单笔上限"), w(e.reserve >= 3n * e.gasTx, "费用总预留至少覆盖 3 笔单笔 Gas 上限（授权、挂单、撤回）；不会再额外扣一份预留"), n31.enableLimits === true) {
    e.capital = Ue(n31.capitalDAI || "0", 18, "资金占用上限", true), e.maxTokens = Ue(n31.maxInventory || "0", 9, "最大持仓", true), e.dailyBuy = Ue(n31.dailyNewBuyDAI || "0", 18, "每日新增锁款上限", true);
    let t = Ws(n31.maxTxDay || 0, 0, 1e4, "每日交易次数");
    e.txDay = t || null;
  }
  return e;
}
var he = (n31) => n31.sell ? Oe(n31.wantTotal * Ve, n31.giveTotal) : n31.giveTotal * Ve / n31.wantTotal, ar = (n31) => n31.sell ? n31.giveLeft : n31.giveLeft * n31.wantTotal / n31.giveTotal, J0 = (n31, e) => BigInt(n31.id) < BigInt(e.id) ? -1 : BigInt(n31.id) > BigInt(e.id) ? 1 : 0;
function ia(n31, e, t, r = Date.now()) {
  let s = n31.filter((c) => c.open && c.expiry * 1e3 > r && !U(c.maker, t) && c.giveLeft > 0n && c.giveTotal > 0n && c.wantTotal > 0n), i = s.filter((c) => ar(c) >= e.big), a = i.filter((c) => !c.sell).sort((c, f) => he(c) === he(f) ? J0(c, f) : he(c) > he(f) ? -1 : 1), o = i.filter((c) => c.sell).sort((c, f) => he(c) === he(f) ? J0(c, f) : he(c) < he(f) ? -1 : 1);
  return { buys: a, sells: o, bid: a[0] || null, ask: o[0] || null, ignoredSmall: s.length - i.length, validOrders: s.length };
}
function j0(n31, e) {
  w(e >= 0n, "钱包数量异常"), e > 0n && w(n31.initialCost > 0n, "钱包已有 LGNS，必须填写每枚实际成本");
  let t = Oe(e * n31.initialCost, Ve);
  return w(n31.maxTokens === null || e <= n31.maxTokens, "现有库存超过已启用的最大持仓"), w(n31.capital === null || t <= n31.capital, "现有库存成本超过已启用的资金上限"), { tokens: e.toString(), cost: t.toString(), realized: "0", since: e ? Date.now() : null };
}
function aa(n31, e) {
  let t = e.bid ? he(e.bid) + W0 : null, r = e.ask ? mt(1n, he(e.ask) - W0) : null;
  return { bid: t, ask: r, buyBlocked: t === null ? "没有符合门槛的大额买单" : t > n31.maxBuy ? "竞争买价超过最高买价" : null, sellBlocked: r === null ? "没有符合门槛的大额卖单" : r < n31.minSell ? "竞争卖价低于最低卖价" : null };
}
function ra(n31, e, t = 1, r = Date.now()) {
  let s = sr(e, Bn(r));
  return n31.txDay !== null && s.tx + t > n31.txDay ? "已启用的每日交易次数不足" : BigInt(s.gasSpent) + BigInt(s.gasReserved) + BigInt(t) * n31.gasTx > n31.gasDay ? "每日 Gas 预算不足" : null;
}
var Lr = (n31) => G0(n31.walletDAI, n31.native), Z0 = (n31) => ({ tokens: BigInt(n31.basis.tokens), cost: BigInt(n31.basis.cost) });
function sa(n31, e, t, r, s = Date.now()) {
  let i = [], { tokens: a, cost: o } = Z0(e), c = t.orders.filter((h) => h.open && !h.sell), f = c.reduce((h, m) => h + m.giveLeft, 0n), d = c.reduce((h, m) => h + ar(m), 0n);
  if (r.buyBlocked) return { qty: 0n, pay: 0n, bid: r.bid, reasons: [r.buyBlocked], blocked: true };
  if (r.ask === null) return { qty: 0n, pay: 0n, bid: r.bid, reasons: ["缺少大额卖单，无法测算买入后的卖出净差价"], blocked: true };
  let l = mt(0n, Lr(t) - n31.reserve);
  if (n31.capital !== null) {
    let h = mt(0n, n31.capital - o - f);
    h < l && (i.push("已启用的资金占用上限限制买量"), l = h);
  }
  if (n31.dailyBuy !== null) {
    let h = mt(0n, n31.dailyBuy - BigInt(sr(e, Bn(s)).buyCommitted));
    h < l && (i.push("已启用的每日新增锁款额度限制买量"), l = h);
  }
  let x = r.bid > 0n ? l * Ve / r.bid : 0n;
  if (n31.maxTokens !== null) {
    let h = mt(0n, n31.maxTokens - a - d);
    h < x && (i.push("已启用的最大持仓限制买量"), x = h);
  }
  if (x > 0n) {
    let h = x * r.bid / Ve;
    h < l && (l = h), x = Oe(l * Ve, r.bid);
  }
  n31.maxTokens !== null && a + d + x > n31.maxTokens && (x = mt(0n, n31.maxTokens - a - d), l = x * r.bid / Ve), (l < n31.buyTrigger && !e.replacements?.buy || x === 0n) && i.push("扣除费用总预留及已启用限制后，未达到挂买门槛");
  let p = 6n * n31.gasTx, b = r.ask > r.bid ? x * r.ask / Ve - l - p : -p;
  return (r.ask <= r.bid || b < n31.profit) && i.push("按当前目标卖价测算，价差不足覆盖完整费用和最低净差价"), { qty: x, pay: l, bid: r.bid, reasons: i, expected: b, cycleGas: p, blocked: i.some((h) => !h.includes("限制买量")) };
}
function Js(n31, e, t, r, s = null) {
  let i = [], { tokens: a, cost: o } = Z0(e), c = t.walletLGNS, f = c < n31.sellTrigger && !e.replacements?.sell || c === 0n;
  if (f && i.push("钱包未锁定 LGNS 未达到挂卖门槛"), r.ask === null) return { qty: c, ask: null, proceeds: 0n, reasons: [...i, "没有符合门槛的大额卖单"], blocked: true };
  w(c <= a, "钱包 LGNS 超出已核对库存");
  let d = a ? Oe(o * c, a) : 0n, l = mt(0n, BigInt(e.gasSession || 0) - BigInt(e.basis.realized || 0)), x = a ? Oe(l * c, a) : 0n, p = (s ?? (t.allowLGNS >= c ? 2n : 3n)) * n31.gasTx, b = c ? Oe((d + x + p + n31.profit) * Ve, c) : n31.minSell, h = mt(n31.minSell, mt(r.ask, b)), m = Oe(c * h, Ve);
  return h > r.ask && i.push("成本、费用或最低卖价保护生效，保护价暂时无法超越大额卖一"), { qty: c, ask: h, proceeds: m, allocated: d, historic: x, future: p, expected: m - d - x - p, reasons: i, blocked: f };
}
var Ot = (n31, e) => ({ type: "cancel", id: n31.id, to: Q, data: le.encodeFunctionData("cancel", [n31.id]), value: "0", purpose: e }), q0 = (n31, e) => ({ ...n31, orders: n31.orders.filter((t) => t.id !== e.id), walletDAI: n31.walletDAI + (e.sell ? 0n : e.giveLeft), native: n31.native + (e.sell ? 0n : e.giveLeft), walletLGNS: n31.walletLGNS + (e.sell ? e.giveLeft : 0n) }), vd = (n31, e, t) => ar(n31) * (e - he(n31)) / Ve - 6n * t.gasTx;
function oa(n31, e, t, r, s, i = Date.now()) {
  w(!e.pending, "有待确认交易，不能重复操作");
  let a = t.orders.filter((l) => l.open), o = a.filter((l) => !l.sell), c = a.filter((l) => l.sell), f = [];
  w(o.length <= 1 && c.length <= 1, "同方向出现重复订单，暂停核对");
  for (let l of a) w(U(l.maker, e.address), "订单钱包与当前地址不符");
  if (e.status === "draining") {
    if (a.length) return { action: Ot(a[0], "drain"), reason: "撤回脚本挂单" };
    for (let [l, x] of [[He, t.allowLGNS], [Le, t.allowDAI]]) if (x > 0n) return { action: zs(l, 0n), reason: "清零残余授权" };
    return { done: true, reason: "脚本订单已撤回，授权已清零" };
  }
  if (e.status !== "running") return { reason: e.basisMismatch || e.nextReason || "已暂停新增交易；旧订单仍可能成交" };
  if (e.basisMismatch) return { reason: e.basisMismatch };
  let d = a.find((l) => l.expiry * 1e3 <= i);
  if (d) return { action: Ot(d, "expired"), reason: "撤回过期订单，确认后按最新余额和盘口重新计算" };
  if (n31.maxTokens !== null && BigInt(e.basis.tokens) + o.reduce((l, x) => l + ar(x), 0n) > n31.maxTokens && o.length) return { action: Ot(o[0], "limit"), reason: "库存及在途买量超过已启用的最大持仓，撤回买单" };
  if (n31.capital !== null && BigInt(e.basis.cost) + o.reduce((l, x) => l + x.giveLeft, 0n) > n31.capital && o.length) return { action: Ot(o[0], "limit"), reason: "库存成本及买单锁款超过已启用的资金占用上限，撤回买单" };
  for (let l of a) {
    if (!l.sell && he(l) > n31.maxBuy) return { action: Ot(l, "boundary"), reason: "旧买单超过最高买价，撤回" };
    if (l.sell && he(l) < n31.minSell) return { action: Ot(l, "boundary"), reason: "旧卖单低于最低卖价，撤回" };
    if (!l.sell && s.ask !== null && vd(l, s.ask, n31) < n31.profit) return { action: Ot(l, "profit"), reason: "旧买单按当前卖价已不能覆盖费用及最低净差价，撤回" };
    if (l.sell) {
      let x = q0(t, l), p = Js(n31, { ...e, replacements: { ...e.replacements, sell: true } }, x, s, 1n);
      if (p.ask !== null && he(l) < p.ask && p.ask > s.ask) return { action: Ot(l, "profit"), reason: "旧卖价低于当前成本和费用保护价，撤回后重新核价" };
    }
  }
  for (let l of a) {
    let x = q0(t, l), p = { ...e, replacements: { ...e.replacements, [l.sell ? "sell" : "buy"]: true } }, b = l.sell ? Js(n31, p, x, s) : sa(n31, p, x, s, i), h = he(l), m = l.sell ? b.ask : b.bid, y = l.sell ? t.walletLGNS : mt(0n, Lr(t) - n31.reserve), I = l.sell ? n31.sellTrigger : n31.buyTrigger, E = y >= I && !b.blocked && (l.sell ? b.qty > ar(l) : b.pay > l.giveLeft), C = l.sell ? r.ask && h >= he(r.ask) : r.bid && h <= he(r.bid), S = lgnsShouldReprice({ enabled: n31.autoFollow, lostLead: C, sell: l.sell, currentPrice: h, targetPrice: m, remainingQty: ar(l), gasPerTx: n31.gasTx, minimumNetProfit: n31.profit });
    if (!E && !S) {
      f.push((l.sell ? "卖单" : "买单") + (C && !n31.autoFollow ? "自动跟价已关闭，保留原单" : "报价已领先或无须调整，保留原单"));
      continue;
    }
    if (b.blocked) {
      f.push((l.sell ? "卖单" : "买单") + "：" + b.reasons.join("；"));
      continue;
    }
    if (i - (e.lastRepriceAt || 0) < n31.interval) {
      f.push("撤挂冷却中，保留当前订单");
      continue;
    }
    if (b.expected < n31.profit + 2n * n31.gasTx) {
      f.push("调整后的净差价不足以覆盖额外撤挂费用，保留原单");
      continue;
    }
    let T = ra(n31, e, 3, i);
    if (T) {
      f.push(T + "，保留原单");
      continue;
    }
    if (Lr(t) < n31.gasTx) {
      f.push("钱包余额不足以支付撤单 Gas，保留原单");
      continue;
    }
    return { action: Ot(l, "reprice"), reason: (E ? "达到余额门槛，合并可用余额与剩余订单" : C ? "对手报价变化，调整竞争报价" : l.sell ? "卖单领先过多，提高报价后仍领先有效大额对手" : "买单领先过多，降低报价后仍领先有效大额对手") + "；撤单确认后重新计算，不直接使用旧报价" };
  }
  if (!c.length) {
    let l = Js(n31, e, t, s);
    if (!l.blocked && l.ask !== null) if (o.length && l.ask <= he(o[0])) f.push("卖价与自己的买单交叉，等待核价");
    else {
      let x = ra(n31, e, t.allowLGNS >= l.qty ? 1 : 2, i);
      if (x) f.push(x);
      else if (Lr(t) < n31.gasTx * (t.allowLGNS >= l.qty ? 1n : 2n)) f.push("可用费用不足以授权及挂卖");
      else return t.allowLGNS < l.qty ? { action: zs(He, l.qty), reason: "限定授权本次全量卖单数量" } : { action: { ...Qi(true, l.qty, l.proceeds, n31.duration), balanceSized: true }, reason: "达标后全量挂卖；" + (l.ask > s.ask ? "使用成本和费用保护价" : "比有效大额卖一低 0.000001") };
    }
    else f.push(...l.reasons);
  }
  if (!o.length) {
    let l = sa(n31, e, t, s, i);
    if (!l.blocked && l.qty > 0n && l.pay > 0n) if (c.length && Oe(l.pay * Ve, l.qty) >= he(c[0])) f.push("买价与自己的卖单交叉，等待核价");
    else {
      let x = ra(n31, e, t.allowDAI >= l.pay ? 1 : 2, i);
      if (x) f.push(x);
      else return t.allowDAI < l.pay ? { action: zs(Le, l.pay), reason: "限定授权本次全量买单金额" } : { action: { ...Qi(false, l.pay, l.qty, n31.duration), balanceSized: true }, reason: "费用只预留一次，剩余可用 DAI 全量挂买；目标高于有效大额买一 0.000001" };
    }
    else f.push(...l.reasons);
  }
  return { reason: [...new Set(f)].join("；") || "已有报价领先或无需调整，等待成交" };
}
function ca(n31, e, t, r, s) {
  let i = sa(n31, e, t, s), a = Js(n31, e, t, s), o = sr(e, Bn(Date.now())), c = (f) => ({ id: f.id, price: Z(he(f)), remainingLGNS: Xe(ar(f)) });
  return { bestBuy: r.bid ? c(r.bid) : null, bestSell: r.ask ? c(r.ask) : null, buys: r.buys.slice(0, 5).map(c), sells: r.sells.slice(0, 5).map(c), ignoredSmall: r.ignoredSmall, bigOrderLGNS: Xe(n31.big), step: "0.000001", targetBuy: s.bid === null ? null : Z(s.bid), targetSell: s.ask === null ? null : Z(s.ask), sellProtectionPrice: a.ask === null ? null : Z(a.ask), freeDAI: Z(Lr(t)), reserveDAI: Z(n31.reserve), extraHiddenReserveDAI: "0", availableBuyDAI: Z(i.pay), availableBuyLGNS: Xe(i.qty), availableSellLGNS: Xe(a.qty), buyReasons: i.reasons, sellReasons: a.reasons, expectedBuyCycleNetDAI: i.expected === void 0 ? null : Z(i.expected), expectedSellNetDAI: a.expected === void 0 ? null : Z(a.expected), costDAI: Z(BigInt(e.basis.cost)), gasSpentDAI: Z(BigInt(e.gasSession || 0)), daily: { date: Bn(Date.now()), gasSpentDAI: Z(BigInt(o.gasSpent)), gasReservedDAI: Z(BigInt(o.gasReserved)), gasLimitDAI: Z(n31.gasDay), newLockedDAI: Z(BigInt(o.buyCommitted)), tx: o.tx }, limits: { enabled: !!(n31.capital || n31.dailyBuy || n31.maxTokens || n31.txDay), capitalDAI: n31.capital === null ? null : Z(n31.capital), dailyNewBuyDAI: n31.dailyBuy === null ? null : Z(n31.dailyBuy), maxInventory: n31.maxTokens === null ? null : Xe(n31.maxTokens), maxTxDay: n31.txDay } };
}
var X0 = (n31) => ({ ...n31, giveTotal: BigInt(n31.giveTotal), wantTotal: BigInt(n31.wantTotal), giveLeft: BigInt(n31.giveLeft) }), Ed = ["Created", "Filled", "Closed"].map((n31) => le.getEvent(n31).topicHash);
function Y0(n31, e, t, r, s) {
  let i = BigInt(n31.basis.tokens), a = BigInt(n31.basis.cost), o = BigInt(n31.basis.realized), c = BigInt(n31.cash);
  if (e) i || (n31.basis.since = s), i += t, a += r, c -= r;
  else {
    w(i >= t, "成交数量超过已核对库存");
    let f = t === i ? a : Oe(a * t, i);
    i -= t, a -= f, o += r - f, c += r, i || (n31.basis.since = null);
  }
  w(c >= 0n, "成交后资金账本为负"), Object.assign(n31.basis, { tokens: i.toString(), cost: a.toString(), realized: o.toString() }), n31.cash = c.toString();
}
function Ad(n31, e, t, r = Date.now()) {
  let s = structuredClone(n31), i = new Map(e.map((o) => [o.id, { ...o }])), a = [...t].sort((o, c) => Number(BigInt(o.blockNumber) - BigInt(c.blockNumber)) || Number(BigInt(o.transactionIndex) - BigInt(c.transactionIndex)) || Number(BigInt(o.logIndex) - BigInt(c.logIndex)));
  for (let o of a) {
    w(!o.removed && U(o.address, Q), "无效或已移除的盘口日志");
    let c = le.parseLog(o), f = c.args, d = f.id.toString();
    if (c.name === "Created") {
      i.set(d, { id: d, maker: f.maker, sell: f.sellAilgns, open: true, expiry: Number(f.expiry), giveTotal: f.give, wantTotal: f.want, giveLeft: f.give, seenAt: r });
      continue;
    }
    if (c.name === "Closed") {
      let x = i.get(d), p = x ? x.sell ? "sell" : "buy" : s.requotes?.sell?.orderId === d ? "sell" : "buy", b = s.requotes?.[p];
      if (b?.orderId === d) {
        let m = (x ? x.sell ? x.giveLeft : x.giveLeft * x.wantTotal / x.giveTotal : 0n) + BigInt(b.extraQuantity || 0);
        b.quantity = (m < BigInt(b.quantity) ? m : BigInt(b.quantity)).toString(), b.ready = true, b.closedAt = r, m === 0n && delete s.requotes[p];
      }
      i.delete(d);
      continue;
    }
    let l = i.get(d);
    if (w(l, "盘口日志缺少对应订单，请重建索引"), c.name === "Filled") {
      let x = s.managed?.find((p) => p.id === d);
      if (s.activeSession && (x || U(f.taker, s.address))) {
        let p = x ? !l.sell : l.sell, b = x ? l.sell ? f.amount : f.paid : l.sell ? f.amount - f.fee : f.paid, h = x ? l.sell ? f.paid : f.amount : l.sell ? f.paid : f.amount - f.fee;
        if (x) Y0(s, !l.sell, l.sell ? f.amount : f.paid, l.sell ? f.paid : f.amount, r), x.lastFillAt = r;
        else {
          w(!U(l.maker, s.address), "禁止自己与自己成交"), Y0(s, l.sell, l.sell ? f.amount - f.fee : f.paid, l.sell ? f.paid : f.amount - f.fee, r);
          let m = l.sell ? "buy" : "sell", y = s.requotes?.[m];
          if (y?.ready) {
            let I = BigInt(y.quantity) - (l.sell ? f.amount - f.fee : f.paid);
            I > 0n ? y.quantity = I.toString() : delete s.requotes[m];
          }
        }
        s.trades ||= [], s.trades.unshift({ time: r, hash: o.transactionHash, order: d, role: x ? "挂单成交" : "主动吃单", buy: p, qty: b.toString(), cash: h.toString(), amount: f.amount.toString(), paid: f.paid.toString(), fee: f.fee.toString() }), s.trades = s.trades.slice(0, 60);
      }
      l.giveLeft = f.giveLeft, l.open = f.giveLeft > 0n, l.open || i.delete(d), s.recentTrades ||= [], s.recentTrades.unshift({ price: (l.sell ? Oe(f.paid * 1000000000n, f.amount) : f.amount * 1000000000n / f.paid).toString(), block: Number(BigInt(o.blockNumber)), time: r }), s.recentTrades = s.recentTrades.slice(0, 30);
    }
  }
  return { state: s, book: [...i.values()] };
}
function Q0(n31, e, t) {
  let r = n31.logs.filter((d) => U(d.address, Q)).map((d) => {
    try {
      return le.parseLog(d);
    } catch {
      return null;
    }
  }).filter((d) => d?.name === "Filled" && d.args.id === BigInt(e.id) && U(d.args.taker, t));
  w(r.length === 1, "吃单回执未匹配");
  let s = r[0].args;
  w(s.amount === BigInt(e.amount) && s.paid <= BigInt(e.maxPay) && s.fee === s.amount / 100n, "吃单数量、付款或手续费不符");
  let i = n31.logs.map((d) => {
    try {
      let l = Ke.parseLog(d);
      return l?.name === "Transfer" ? { token: d.address, from: l.args.from, to: l.args.to, value: l.args.value } : null;
    } catch {
      return null;
    }
  }).filter(Boolean), a = e.sell ? Le : He, o = e.sell ? He : Le, c = i.filter((d) => U(d.token, a) && U(d.from, t) && U(d.to, e.maker)).reduce((d, l) => d + l.value, 0n), f = i.filter((d) => U(d.token, o) && U(d.from, Q) && U(d.to, t)).reduce((d, l) => d + l.value, 0n);
  return w(c === s.paid && f === s.amount - s.fee, "实际代币转账与预期不符"), s;
}
async function ec(n31, e, t, r, s) {
  let i = await n31.call("eth_getBlockByNumber", [ot(e.cursor.block), false]);
  w(i?.hash === e.cursor.hash, "发现链重组，需核对盘口及成交"), w(r >= e.cursor.block, "链上同步区块倒退，需核对");
  let a = Math.min(r, e.cursor.block + 1800), o = a === r;
  if (a === e.cursor.block) return { state: e, book: t, complete: true };
  let c = o ? s : (await n31.call("eth_getBlockByNumber", [ot(a), false]))?.hash;
  w(c, "无法确认补同步区块");
  let f = await n31.call("eth_getLogs", [{ address: Q, fromBlock: ot(e.cursor.block + 1), toBlock: ot(a), topics: [Ed] }]);
  w(Array.isArray(f) && f.every((l) => Number(l.blockNumber) > e.cursor.block && Number(l.blockNumber) <= a && !l.removed), "补同步日志区块不符，需核对");
  let d = Ad(e, t, f);
  return d.state.cursor = { block: a, hash: c }, { ...d, complete: o, progress: { processedTo: a, target: r, remaining: r - a } };
}
function Id(n31, e = Date.now()) {
  let t = String(n31);
  return /nonce|账本|签名|哈希|回执|重组|实现|合约代码|手续费改变|小数位|链 ID|钱包发生变化|PRIVATE_KEY|PUBLIC_ADDRESS|迁移|重复|不在名单|授权回执|字段不符|资产不符|格式/.test(t) ? null : /每日 Gas 预算不足|当日交易次数达到上限|每日买单预算不足/.test(t) ? { label: "当日费用或已启用额度不足，等待北京时间次日", nextAt: (Math.floor((e + 288e5) / 864e5) + 1) * 864e5 - 288e5 } : /当前 Gas 单价超过上限|预计单笔 Gas 超过上限|DAI 不足以同时支付|费用总预留/.test(t) ? { label: t, nextAt: e + 6e4 } : /官方 RPC 暂不可用|RPC HTTP (408|429|5\d\d)|RPC:.*(rate limit|too many requests|timeout|timed out|temporarily unavailable)|Too many subrequests|区块时间陈旧|AbortError|TimeoutError|fetch failed|Failed to fetch|NetworkError|network connection lost|operation was aborted/i.test(t) ? { label: "网络或盘口暂不可用，等待重查", nextAt: e + 6e4 } : null;
}
function tc(n31, e, t, r = Date.now()) {
  if (!n31?.autoRecover || !e.activeSession || e.pauseSource === "user" || e.pauseSource === "safety" || e.status === "paused") return false;
  let s = Id(t, r);
  if (!s) return false;
  let i = e.wait?.resumeStatus || (e.status === "draining" ? "draining" : "running");
  return e.wait = { ...s, resumeStatus: i, healthy: 0, lastBlock: null, lastAt: 0 }, e.status = "waiting", e.pauseSource = "transient", e.lastError = String(t), e.nextAction = null, e.nextReason = s.label, true;
}
function nc(n31, e, t = Date.now()) {
  if (n31.status !== "waiting" || !n31.wait || t < n31.wait.nextAt || n31.basisMismatch || n31.pending || n31.pauseSource !== "transient") return false;
  let r = n31.wait;
  return e.block !== r.lastBlock && t - r.lastAt >= 15e3 && (r.healthy++, r.lastAt = t, r.lastBlock = e.block), n31.nextReason = r.label + "；有效区块检查 " + r.healthy + "/2", r.healthy < 2 ? false : (n31.status = r.resumeStatus, n31.wait = null, n31.lastError = null, n31.pauseSource = null, true);
}
var ic = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "X-Frame-Options": "DENY" }, ye = (n31, e = 200) => new Response(JSON.stringify(Cr(n31)), { status: e, headers: { ...ic, "Content-Type": "application/json;charset=utf-8" } }), rc = (n31) => String(n31?.message || "操作失败").replace(/0x[0-9a-fA-F]{64,}/g, "[数据已隐藏]").slice(0, 240), Ct = (n31) => n31 ? { ...n31, pending: n31.pending ? { hash: n31.pending.hash, type: n31.pending.action.type, nonce: n31.pending.nonce, startedAt: n31.pending.startedAt, ack: n31.pending.ack } : null } : null, Sd = ["schemaVersion", "bigOrderLGNS", "sellTriggerLGNS", "buyTriggerDAI", "reserveDAI", "maxBuyPrice", "minSellPrice", "minProfitDAI", "initialCostPrice", "maxGasTxDAI", "maxGasDayDAI", "maxGasGwei", "refreshSeconds", "repriceIntervalSeconds", "orderMinutes", "autoRecover", "autoFollow", "enableLimits", "capitalDAI", "maxInventory", "dailyNewBuyDAI", "maxTxDay"], Bd = (n31) => Object.fromEntries(Sd.filter((e) => Object.hasOwn(n31, e)).map((e) => [e, n31[e]])), Bg = { async fetch(n31, e) {
  let t = new URL(n31.url).pathname;
  if (t === "/" && n31.method === "GET") return new Response(F0, { headers: { ...ic, "Content-Type": "text/html;charset=utf-8", "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'" } });
  if (!t.startsWith("/api/")) return ye({ error: "Not found" }, 404);
  if (!e.APP_PASSWORD || e.APP_PASSWORD.length < 20) return ye({ error: "请配置 APP_PASSWORD Secret（至少 20 位，建议 32 位以上）" }, 503);
  if (ue(me(n31.headers.get("Authorization") || "")) !== ue(me("Bearer " + e.APP_PASSWORD))) return ye({ error: "管理密码错误" }, 401);
  let r = n31.headers.get("Origin");
  return r && r !== new URL(n31.url).origin ? ye({ error: "跨站请求被拒绝" }, 403) : e.MERCHANT ? Number(n31.headers.get("Content-Length") || 0) > 16e3 ? ye({ error: "请求过大" }, 413) : e.MERCHANT.get(e.MERCHANT.idFromName("lgns-maker-v2")).fetch(n31) : ye({ error: "缺少 MERCHANT 云端执行器绑定" }, 503);
} }, sc = class extends kd {
  constructor(e, t) {
    super(e, t), this.ctx = e, this.env = t, this.queue = Promise.resolve();
  }
  serial(e) {
    let t = this.queue.then(e);
    return this.queue = t.catch(() => {
    }), t;
  }
  fetch(e) {
    return this.serial(() => this.handle(e));
  }
  alarm() {
    return this.serial(() => this.tick(false));
  }
  log(e, t) {
    e.logs ||= [], e.logs.at(-1)?.message !== t && (e.logs.push({ time: Date.now(), message: t }), e.logs = e.logs.slice(-100));
  }
  async loadBook() {
    let t = [...(await this.ctx.storage.list({ prefix: "book:", limit: 60 })).values()].flat().map(X0);
    return w(t.length <= 5e3, "盘口超过当前版本处理上限"), t;
  }
  async save(e, t, r) {
    let s = e.bookChunks || 0, i = [];
    w(t.length <= 5e3, "有效订单超过 5000 张，暂停");
    for (let a = 0; a < t.length; a += 100) i.push(t.slice(a, a + 100));
    e.bookChunks = i.length, await this.ctx.storage.transaction(async (a) => {
      for (let o = 0; o < i.length; o++) await a.put("book:" + String(o).padStart(3, "0"), Cr(i[o]));
      for (let o = i.length; o < s; o++) await a.delete("book:" + String(o).padStart(3, "0"));
      await a.put("state", Cr(e)), r ? await a.setAlarm(r) : await a.deleteAlarm();
    });
  }
  next(e, t = 15e3) {
    return e.activeSession || e.pending || e.status === "indexing" || e.syncProgress ? Date.now() + t : null;
  }
  async beginIndex(e, t, r) {
    w(!e?.activeSession && !e?.pending && !e?.managed?.length, "请先撤回订单并核对结束旧任务，再重建盘口");
    let s = await na(t, r), i = Number((await t.view(Q, le, "ordersCount", [], ot(s.block)))[0]);
    w(i <= 2e5, "历史订单过多，需升级索引器");
    let a = { version: ct, address: r, status: "indexing", mode: "dry", activeSession: false, managed: [], pending: null, config: e?.config?.schemaVersion === ct ? e.config : null, days: e?.days || {}, logs: e?.logs || [], trades: e?.trades || [], transactions: e?.transactions || [], recentTrades: [], cursor: { block: s.block, hash: s.hash }, index: { from: 0, total: i, block: s.block }, bookChunks: e?.bookChunks || 0, report: Ks(s), gasSession: "0", gasModel: "shared-dai" };
    return this.log(a, "分批建立完整 OTC 盘口，完成前不交易"), await this.save(a, [], Date.now() + 1e3), a;
  }
  async update(e, t, r) {
    let s = await na(e, t.address, t.managed || []), i = await ec(e, t, r, s.block, s.hash);
    if (Object.assign(t, i.state), r = i.book, !i.complete) return t.syncProgress = i.progress, t.nextAction = null, t.nextReason = "正在补齐链上记录，还差 " + i.progress.remaining + " 块；完成前不交易", await this.save(t, r, Date.now() + 1e3), { x: s, book: r, syncing: true };
    if (t.syncProgress = null, t.activeSession && t.basis && t.cash != null) {
      let a = s.walletLGNS + s.orders.filter((c) => c.open && c.sell).reduce((c, f) => c + f.giveLeft, 0n), o = s.walletDAI + s.orders.filter((c) => c.open && !c.sell).reduce((c, f) => c + f.giveLeft, 0n);
      t.basisMismatch = a !== BigInt(t.basis.tokens) || o !== BigInt(t.cash) ? "钱包与挂单合计资产不符合账本，可能有外部转账或未记录操作" : null;
    }
    return t.managed = (t.managed || []).filter((a) => s.orders.some((o) => o.id === a.id && o.open)), t.updatedAt = Date.now(), t.report = { ...t.report, ...Ks(s), lockedBuyDAI: Z(s.orders.filter((a) => a.open && !a.sell).reduce((a, o) => a + o.giveLeft, 0n)), lockedSellLGNS: Xe(s.orders.filter((a) => a.open && a.sell).reduce((a, o) => a + o.giveLeft, 0n)) }, await this.save(t, r, this.next(t)), { x: s, book: r, syncing: false };
  }
  async handle(e) {
    try {
      let t = new URL(e.url).pathname, r = await this.ctx.storage.get("state");
      if (e.method === "GET" && t === "/api/status") return ye({ version: "3.0.0", market: "LGNS / DAI · Anubis 6714", address: Pn(this.env).address, signer: !!this.env.PRIVATE_KEY, state: Ct(r), serverTime: Date.now() });
      if (e.method === "GET" && t === "/api/export") return ye({ state: Ct(r), book: await this.loadBook(), exportedAt: (/* @__PURE__ */ new Date()).toISOString(), note: "不包含私钥、管理密码或签名原文；导出文件不能直接覆盖在线状态" });
      w(e.method === "POST", "请求方式错误");
      let s = await e.text();
      w(s.length <= 16e3, "请求过大");
      let i = s ? JSON.parse(s) : {};
      if (t === "/api/refresh") return r ? await this.tick(true) : await this.beginIndex(null, await ir(), Pn(this.env).address), ye({ state: Ct(await this.ctx.storage.get("state")) });
      if (t === "/api/reindex") return await this.beginIndex(r, await ir(), Pn(this.env).address), ye({ state: Ct(await this.ctx.storage.get("state")) });
      if (w(r, "请先初始化并同步盘口"), t === "/api/pause") return r.status = "paused", r.pauseSource = "user", r.wait = null, r.nextReason = "已手动暂停新增交易；已有挂单仍可能成交", this.log(r, r.nextReason), await this.save(r, await this.loadBook(), this.next(r)), ye({ state: Ct(r) });
      if (t === "/api/reset") {
        w(i.confirm === true && !r.pending, "请等待待确认交易处理完成");
        let I = await ir(), E = await this.update(I, r, await this.loadBook());
        return w(!E.syncing, "链上记录尚未补齐"), w(E.x.nonce === E.x.pending, "钱包有未确认交易"), w(!E.book.some((C) => C.open && U(C.maker, r.address)), "该钱包仍有未撤回订单，请先撤回"), Object.assign(r, { version: ct, activeSession: false, status: "idle", managed: [], pending: null, config: r.config?.schemaVersion === ct ? r.config : null, basis: null, cash: null, wait: null, pauseSource: null, replacements: {}, nextAction: null, needsUpgrade: false, gasModel: "shared-dai", lastError: null, basisMismatch: null }), this.log(r, "旧任务已核对结束；当日费用和新增锁款累计保留"), await this.save(r, E.book, null), ye({ state: Ct(r) });
      }
      if (w(r.version === ct && !r.needsUpgrade, "旧版任务不会自动迁移交易；请先撤回旧订单，再核对结束旧任务"), t === "/api/drain") return w(r.activeSession && r.mode === "live" && i.confirm === true, "请确认撤回正式任务挂单"), r.status = "draining", r.pauseSource = null, r.wait = null, r.nextReason = "正在撤回脚本挂单及授权；不会主动卖出库存", this.log(r, r.nextReason), await this.save(r, await this.loadBook(), Date.now() + 1e3), ye({ state: Ct(r) });
      if (t === "/api/resume") return w(r.activeSession && r.status === "paused" && i.confirm === true, "请确认恢复原任务"), w(!r.syncProgress && !r.basisMismatch && !r.pending, "请先同步并核对资产与待确认交易"), Ur(r.config), r.status = "running", r.pauseSource = null, r.wait = null, r.lastError = null, this.log(r, "恢复原任务，下一轮重新核价"), await this.save(r, await this.loadBook(), Date.now() + 1e3), ye({ state: Ct(r) });
      w(["/api/check", "/api/start", "/api/config"].includes(t), "接口不存在");
      let a = Bd(i.config || {}), o = Ur(a), c = Pn(this.env, t === "/api/start" && i.mode === "live");
      w(r.status !== "indexing", "盘口索引尚未完成"), w(U(r.address, c.address), "钱包地址变化，先处理旧任务"), w(!r.pending, "有待确认交易，先等待结果");
      let f = await ir(), d = await this.update(f, r, await this.loadBook());
      if (d.syncing) return ye({ syncing: true, message: r.nextReason, progress: r.syncProgress }, 202);
      let { x: l, book: x } = d;
      w(l.nonce === l.pending, "钱包有未确认交易"), (t === "/api/start" || !r.activeSession) && w(!x.some((I) => I.open && U(I.maker, c.address)) && !r.managed.length, "启动前请撤回该钱包所有现有订单");
      let p = r.activeSession ? r.basis : j0(o, l.walletLGNS), b = { ...structuredClone(r), basis: p, cash: r.activeSession ? r.cash : l.walletDAI.toString(), gasSession: r.activeSession ? r.gasSession : "0", status: "running", pending: null }, h = ia(x, o, c.address), m = aa(o, h), y = { ...Ks(l), ...ca(o, b, l, h, m), decision: oa(o, b, l, h, m).reason, note: "预计净差价基于未来卖单成交假设，不是已实现收益" };
      return t === "/api/check" ? (r.activeSession || (r.config = a, r.report = { ...r.report, ...y }, await this.save(r, x, null)), ye({ report: y })) : (w(i.confirm === true, "请确认已核对交易参数"), t === "/api/start" ? (w(!r.activeSession, "请先结束旧任务，再启动新的模式"), w(["dry", "live"].includes(i.mode), "模式无效"), Object.assign(r, { version: ct, activeSession: true, mode: i.mode, status: "running", gasModel: "shared-dai", config: a, basis: p, cash: l.walletDAI.toString(), gasSession: "0", expectedNonce: l.nonce.toString(), createdAt: Date.now(), lastRepriceAt: 0, pauseSource: null, wait: null, lastError: null, basisMismatch: null, replacements: {}, sessionStartTradeAt: Date.now() }), this.log(r, i.mode === "dry" ? "只读模拟已启动，不签名不广播；不制造虚拟成交" : "正式任务已启动，仅执行 OTC 挂单、撤单及限定授权")) : (w(r.activeSession, "没有运行中的任务"), w(!r.basisMismatch, "资产账本不符，先核对"), r.config = a, this.log(r, "参数已更新；原账本、当日 Gas 和累计新增锁款不重置")), await this.save(r, x, Date.now() + 1e3), ye({ state: Ct(r) }));
    } catch (t) {
      return ye({ error: rc(t) }, 400);
    }
  }
  async tick(e = false) {
    let t = await this.ctx.storage.get("state");
    if (!t) return;
    let r = await this.loadBook(), s = null;
    t.heartbeat = Date.now(), this.next(t) && await this.ctx.storage.setAlarm(Date.now() + 6e4);
    try {
      let i = await ir();
      if (w(U(Pn(this.env).address, t.address), "云端钱包发生变化"), t.version !== ct && (t.status = "paused", t.pauseSource = "safety", t.needsUpgrade = true, t.nextReason = "检测到旧版任务，已停止自动交易。请先撤回旧订单并核对结束任务，再配置 V3。"), t.pending) {
        await this.poll(i, t), await this.save(t, r, this.next(t));
        return;
      }
      if (t.index && t.index.from < t.index.total) {
        let l = [];
        for (let p = t.index.from; p < Math.min(t.index.total, t.index.from + 2e3); p += 500) l.push(p);
        let x = await Promise.all(l.map(async (p) => (await i.view(Q, le, "getOrders", [p, 500], ot(t.index.block)))[0]));
        for (let p = 0; p < x.length; p++) for (let b = 0; b < x[p].length; b++) x[p][b].open && r.push({ ...Vs(x[p][b], l[p] + b), seenAt: Date.now() });
        t.index.from = Math.min(t.index.total, t.index.from + 2e3), t.index.from === t.index.total && (t.status = "idle", this.log(t, "完整盘口索引已建立")), await this.save(t, r, Date.now() + 1e3);
        return;
      }
      t.status === "indexing" && (t.status = "idle");
      let a = await this.update(i, t, r);
      if (r = a.book, a.syncing) return;
      let o = a.x;
      if (t.needsUpgrade) {
        this.log(t, t.nextReason), await this.save(t, r, this.next(t, 6e4));
        return;
      }
      if (!t.config) {
        t.nextReason = "盘口已同步，请填写参数并检查", await this.save(t, r, null);
        return;
      }
      s = Ur(t.config);
      let c = ia(r, s, t.address), f = aa(s, c);
      if (!t.activeSession) {
        t.nextReason = "参数已保存，等待启动", await this.save(t, r, null);
        return;
      }
      w(o.nonce === o.pending && o.nonce === BigInt(t.expectedNonce), "钱包 nonce 改变或存在外部交易，请核对"), t.basisMismatch && (t.status = "paused", t.pauseSource = "safety", t.wait = null, t.nextReason = t.basisMismatch), s.autoRecover && nc(t, o), t.report = { ...t.report, ...ca(s, t, o, c, f), ownedLGNS: Xe(BigInt(t.basis.tokens)), basisDAI: Z(BigInt(t.basis.cost)), realizedGrossDAI: Z(BigInt(t.basis.realized)), gasDAI: Z(BigInt(t.gasSession)), realizedNetDAI: Z(BigInt(t.basis.realized) - BigInt(t.gasSession)), realizedScope: "本轮成交的已实现毛差价减本轮全部实际 Gas；未售库存不计作已实现盈利" };
      let d = oa(s, t, o, c, f);
      if (t.nextAction = d.action ? Cr(d.action) : null, t.nextReason = d.reason, this.log(t, (t.mode === "dry" ? "模拟（未发送）：" : "") + d.reason), d.done) {
        t.status = "stopped", t.activeSession = false, await this.save(t, r, null);
        return;
      }
      if (d.action && !e && t.mode === "live") {
        w(t.version === ct && !t.needsUpgrade, "旧版任务禁止自动签名");
        let l = Pn(this.env, true), x = d.action, p = await H0(i, l, x, s, o), b = { nonce: Number(o.nonce), action: x, day: Bn(Date.now()), maxFee: p.maxFee.toString(), price: p.price.toString(), startedAt: Date.now(), ack: 0 }, h = structuredClone(t);
        $0(h, s, { ...b, maxFee: p.maxFee });
        let m = await l.signTransaction(p.tx);
        if (b.hash = V0(m, l, p.tx), x.type === "cancel" && ["reprice", "expired", "profit"].includes(x.purpose)) {
          let I = o.orders.find((E) => E.id === x.id);
          t.replacements ||= {}, t.replacements[I.sell ? "sell" : "buy"] = true;
        }
        t.days = h.days, t.pending = b, this.log(t, "交易哈希已持久保存，准备广播 " + x.type), await this.save(t, r, Date.now() + 15e3);
        let y = await K0(m, b.hash);
        t.pending.ack = y.filter((I) => I.status === "fulfilled").length, this.log(t, t.pending.ack ? "节点接收，等待 3 个确认" : "广播结果未知，仅查询原哈希，不重复发送新交易"), await this.save(t, r, Date.now() + 15e3);
        return;
      }
      await this.save(t, r, this.next(t, s.refresh * 1e3));
    } catch (i) {
      let a = rc(i);
      if (!s && t.config?.schemaVersion === ct) try {
        s = Ur(t.config);
      } catch {
      }
      tc(s, t, a) || (t.status = t.index && t.index.from < t.index.total ? "indexing" : "paused", t.lastError = a, t.nextReason = a, t.wait = null, t.nextAction = null, t.pauseSource !== "user" && (t.pauseSource = "safety")), this.log(t, a), await this.save(t, r, this.next(t, 6e4));
    }
  }
  async poll(e, t) {
    let r = structuredClone(t), s = r.pending, i = await e.call("eth_getTransactionReceipt", [s.hash]);
    if (!i || (w(U(i.transactionHash, s.hash), "回执哈希不符"), Number(BigInt(await e.call("eth_blockNumber"))) - Number(BigInt(i.blockNumber)) + 1 < 3)) return;
    let o = await e.call("eth_getBlockByNumber", [i.blockNumber, false]);
    w(o?.hash === i.blockHash, "回执发生链重组");
    let c = BigInt(i.gasUsed) * BigInt(i.effectiveGasPrice || s.price), f = BigInt(i.status) === 1n;
    if (f) if (s.action.type === "create") {
      let d = z0(i, s.action, r.address);
      w(!r.managed.some((l) => l.id === d.id), "重复订单记录"), r.managed.push({ ...d, createdAt: s.startedAt, lastFillAt: s.startedAt, balanceSized: true }), r.replacements && delete r.replacements[s.action.sell ? "sell" : "buy"];
    } else if (s.action.type === "cancel") w(i.logs.some((d) => {
      try {
        let l = U(d.address, Q) && le.parseLog(d);
        return l?.name === "Closed" && l.args.id === BigInt(s.action.id) && U(l.args.maker, r.address);
      } catch {
        return false;
      }
    }), "撤单回执不符"), r.lastRepriceAt = Date.now();
    else if (s.action.type === "fill") Q0(i, s.action, r.address);
    else {
      let d = (await e.view(s.action.token, Ke, "allowance", [r.address, Q], i.blockNumber))[0];
      w(d === BigInt(s.action.amount), "授权回执额度不符");
    }
    M0(r, s, c), r.expectedNonce = String(s.nonce + 1), r.pending = null, r.lastTx = { hash: s.hash, type: s.action.type, gasDAI: Z(c), time: Date.now(), success: f }, r.transactions ||= [], r.transactions.unshift(r.lastTx), r.transactions = r.transactions.slice(0, 100), f || (r.status = "paused", r.pauseSource = "safety", r.wait = null, r.nextReason = "交易回滚且已扣 Gas，暂停核对"), this.log(r, f ? "交易已确认，实际 Gas " + Z(c) + " DAI" : r.nextReason), Object.assign(t, r);
  }
};
export {
  sc as MerchantV2,
  Bg as default
};
