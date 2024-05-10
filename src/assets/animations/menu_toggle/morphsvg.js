!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], e)
    : e(((t = t || self).window = t.window || {}));
})(this, function (t) {
  "use strict";
  function m(t) {
    return "string" == typeof t;
  }
  var b = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
    N = /(?:(-)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
    A = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
    r = /(^[#\.][a-z]|[a-y][a-z])/i,
    D = Math.PI / 180,
    E = Math.sin,
    k = Math.cos,
    Q = Math.abs,
    J = Math.sqrt,
    h = function _isNumber(t) {
      return "number" == typeof t;
    },
    s = function _round(t) {
      return Math.round(1e5 * t) / 1e5 || 0;
    };
  function reverseSegment(t) {
    var e,
      n = 0;
    for (t.reverse(); n < t.length; n += 2)
      (e = t[n]), (t[n] = t[n + 1]), (t[n + 1] = e);
    t.reversed = !t.reversed;
  }
  var R = {
    rect: "rx,ry,x,y,width,height",
    circle: "r,cx,cy",
    ellipse: "rx,ry,cx,cy",
    line: "x1,x2,y1,y2",
  };
  function convertToPath(t, e) {
    var n,
      r,
      o,
      a,
      i,
      h,
      s,
      l,
      c,
      g,
      f,
      p,
      u,
      d,
      P,
      _,
      m,
      w,
      v,
      y,
      x,
      M,
      T = t.tagName.toLowerCase(),
      b = 0.552284749831;
    return "path" !== T && t.getBBox
      ? ((h = (function _createPath(t, e) {
          var n,
            r = document.createElementNS("http://www.w3.org/2000/svg", "path"),
            o = [].slice.call(t.attributes),
            a = o.length;
          for (e = "," + e + ","; -1 < --a; )
            (n = o[a].nodeName.toLowerCase()),
              e.indexOf("," + n + ",") < 0 &&
                r.setAttributeNS(null, n, o[a].nodeValue);
          return r;
        })(t, "x,y,width,height,cx,cy,rx,ry,r,x1,x2,y1,y2,points")),
        (M = (function _attrToObj(t, e) {
          for (var n = e ? e.split(",") : [], r = {}, o = n.length; -1 < --o; )
            r[n[o]] = +t.getAttribute(n[o]) || 0;
          return r;
        })(t, R[T])),
        "rect" === T
          ? ((a = M.rx),
            (i = M.ry || a),
            (r = M.x),
            (o = M.y),
            (g = M.width - 2 * a),
            (f = M.height - 2 * i),
            (n =
              a || i
                ? "M" +
                  (_ = (d = (u = r + a) + g) + a) +
                  "," +
                  (w = o + i) +
                  " V" +
                  (v = w + f) +
                  " C" +
                  [
                    _,
                    (y = v + i * b),
                    (P = d + a * b),
                    (x = v + i),
                    d,
                    x,
                    d - (d - u) / 3,
                    x,
                    u + (d - u) / 3,
                    x,
                    u,
                    x,
                    (p = r + a * (1 - b)),
                    x,
                    r,
                    y,
                    r,
                    v,
                    r,
                    v - (v - w) / 3,
                    r,
                    w + (v - w) / 3,
                    r,
                    w,
                    r,
                    (m = o + i * (1 - b)),
                    p,
                    o,
                    u,
                    o,
                    u + (d - u) / 3,
                    o,
                    d - (d - u) / 3,
                    o,
                    d,
                    o,
                    P,
                    o,
                    _,
                    m,
                    _,
                    w,
                  ].join(",") +
                  "z"
                : "M" +
                  (r + g) +
                  "," +
                  o +
                  " v" +
                  f +
                  " h" +
                  -g +
                  " v" +
                  -f +
                  " h" +
                  g +
                  "z"))
          : "circle" === T || "ellipse" === T
          ? ((l =
              "circle" === T
                ? (a = i = M.r) * b
                : ((a = M.rx), (i = M.ry) * b)),
            (n =
              "M" +
              ((r = M.cx) + a) +
              "," +
              (o = M.cy) +
              " C" +
              [
                r + a,
                o + l,
                r + (s = a * b),
                o + i,
                r,
                o + i,
                r - s,
                o + i,
                r - a,
                o + l,
                r - a,
                o,
                r - a,
                o - l,
                r - s,
                o - i,
                r,
                o - i,
                r + s,
                o - i,
                r + a,
                o - l,
                r + a,
                o,
              ].join(",") +
              "z"))
          : "line" === T
          ? (n = "M" + M.x1 + "," + M.y1 + " L" + M.x2 + "," + M.y2)
          : ("polyline" !== T && "polygon" !== T) ||
            ((n =
              "M" +
              (r = (c =
                (t.getAttribute("points") + "").match(N) || []).shift()) +
              "," +
              (o = c.shift()) +
              " L" +
              c.join(",")),
            "polygon" === T && (n += "," + r + "," + o + "z")),
        h.setAttribute(
          "d",
          rawPathToString((h._gsRawPath = stringToRawPath(n)))
        ),
        e &&
          t.parentNode &&
          (t.parentNode.insertBefore(h, t), t.parentNode.removeChild(t)),
        h)
      : t;
  }
  function arcToSegment(t, e, n, r, o, a, i, h, s) {
    if (t !== h || e !== s) {
      (n = Q(n)), (r = Q(r));
      var l = (o % 360) * D,
        c = k(l),
        g = E(l),
        f = Math.PI,
        p = 2 * f,
        u = (t - h) / 2,
        d = (e - s) / 2,
        P = c * u + g * d,
        _ = -g * u + c * d,
        m = P * P,
        w = _ * _,
        v = m / (n * n) + w / (r * r);
      1 < v && ((n = J(v) * n), (r = J(v) * r));
      var y = n * n,
        x = r * r,
        M = (y * x - y * w - x * m) / (y * w + x * m);
      M < 0 && (M = 0);
      var T = (a === i ? -1 : 1) * J(M),
        b = ((n * _) / r) * T,
        S = ((-r * P) / n) * T,
        N = c * b - g * S + (t + h) / 2,
        z = g * b + c * S + (e + s) / 2,
        A = (P - b) / n,
        R = (_ - S) / r,
        O = (-P - b) / n,
        C = (-_ - S) / r,
        j = A * A + R * R,
        Y = (R < 0 ? -1 : 1) * Math.acos(A / J(j)),
        V =
          (A * C - R * O < 0 ? -1 : 1) *
          Math.acos((A * O + R * C) / J(j * (O * O + C * C)));
      isNaN(V) && (V = f),
        !i && 0 < V ? (V -= p) : i && V < 0 && (V += p),
        (Y %= p),
        (V %= p);
      var I,
        F = Math.ceil(Q(V) / (p / 4)),
        U = [],
        X = V / F,
        L = ((4 / 3) * E(X / 2)) / (1 + k(X / 2)),
        G = c * n,
        q = g * n,
        H = g * -r,
        B = c * r;
      for (I = 0; I < F; I++)
        (P = k((o = Y + I * X))),
          (_ = E(o)),
          (A = k((o += X))),
          (R = E(o)),
          U.push(P - L * _, _ + L * P, A + L * R, R - L * A, A, R);
      for (I = 0; I < U.length; I += 2)
        (P = U[I]),
          (_ = U[I + 1]),
          (U[I] = P * G + _ * H + N),
          (U[I + 1] = P * q + _ * B + z);
      return (U[I - 2] = h), (U[I - 1] = s), U;
    }
  }
  function stringToRawPath(t) {
    function yc(t, e, n, r) {
      (c = (n - t) / 3),
        (g = (r - e) / 3),
        h.push(t + c, e + g, n - c, r - g, n, r);
    }
    var e,
      n,
      r,
      o,
      a,
      i,
      h,
      s,
      l,
      c,
      g,
      f,
      p,
      u,
      d,
      P =
        (t + "")
          .replace(A, function (t) {
            var e = +t;
            return e < 1e-4 && -1e-4 < e ? 0 : e;
          })
          .match(b) || [],
      _ = [],
      m = 0,
      w = 0,
      v = P.length,
      y = 0,
      x = "ERROR: malformed path: " + t;
    if (!t || !isNaN(P[0]) || isNaN(P[1])) return console.log(x), _;
    for (e = 0; e < v; e++)
      if (
        ((p = a),
        isNaN(P[e]) ? (i = (a = P[e].toUpperCase()) !== P[e]) : e--,
        (r = +P[e + 1]),
        (o = +P[e + 2]),
        i && ((r += m), (o += w)),
        e || ((s = r), (l = o)),
        "M" === a)
      )
        h && (h.length < 8 ? --_.length : (y += h.length)),
          (m = s = r),
          (w = l = o),
          (h = [r, o]),
          _.push(h),
          (e += 2),
          (a = "L");
      else if ("C" === a)
        i || (m = w = 0),
          (h = h || [0, 0]).push(
            r,
            o,
            m + 1 * P[e + 3],
            w + 1 * P[e + 4],
            (m += 1 * P[e + 5]),
            (w += 1 * P[e + 6])
          ),
          (e += 6);
      else if ("S" === a)
        (c = m),
          (g = w),
          ("C" !== p && "S" !== p) ||
            ((c += m - h[h.length - 4]), (g += w - h[h.length - 3])),
          i || (m = w = 0),
          h.push(c, g, r, o, (m += 1 * P[e + 3]), (w += 1 * P[e + 4])),
          (e += 4);
      else if ("Q" === a)
        (c = m + (2 / 3) * (r - m)),
          (g = w + (2 / 3) * (o - w)),
          i || (m = w = 0),
          (m += 1 * P[e + 3]),
          (w += 1 * P[e + 4]),
          h.push(c, g, m + (2 / 3) * (r - m), w + (2 / 3) * (o - w), m, w),
          (e += 4);
      else if ("T" === a)
        (c = m - h[h.length - 4]),
          (g = w - h[h.length - 3]),
          h.push(
            m + c,
            w + g,
            r + (2 / 3) * (m + 1.5 * c - r),
            o + (2 / 3) * (w + 1.5 * g - o),
            (m = r),
            (w = o)
          ),
          (e += 2);
      else if ("H" === a) yc(m, w, (m = r), w), (e += 1);
      else if ("V" === a) yc(m, w, m, (w = r + (i ? w - m : 0))), (e += 1);
      else if ("L" === a || "Z" === a)
        "Z" === a && ((r = s), (o = l), (h.closed = !0)),
          ("L" === a || 0.5 < Q(m - r) || 0.5 < Q(w - o)) &&
            (yc(m, w, r, o), "L" === a && (e += 2)),
          (m = r),
          (w = o);
      else if ("A" === a) {
        if (
          ((u = P[e + 4]),
          (d = P[e + 5]),
          (c = P[e + 6]),
          (g = P[e + 7]),
          (n = 7),
          1 < u.length &&
            (u.length < 3
              ? ((g = c), (c = d), n--)
              : ((g = d), (c = u.substr(2)), (n -= 2)),
            (d = u.charAt(1)),
            (u = u.charAt(0))),
          (f = arcToSegment(
            m,
            w,
            +P[e + 1],
            +P[e + 2],
            +P[e + 3],
            +u,
            +d,
            (i ? m : 0) + 1 * c,
            (i ? w : 0) + 1 * g
          )),
          (e += n),
          f)
        )
          for (n = 0; n < f.length; n++) h.push(f[n]);
        (m = h[h.length - 2]), (w = h[h.length - 1]);
      } else console.log(x);
    return (
      (e = h.length) < 6
        ? (_.pop(), (e = 0))
        : h[0] === h[e - 2] && h[1] === h[e - 1] && (h.closed = !0),
      (_.totalPoints = y + e),
      _
    );
  }
  function rawPathToString(t) {
    h(t[0]) && (t = [t]);
    var e,
      n,
      r,
      o,
      a = "",
      i = t.length;
    for (n = 0; n < i; n++) {
      for (
        o = t[n],
          a += "M" + s(o[0]) + "," + s(o[1]) + " C",
          e = o.length,
          r = 2;
        r < e;
        r++
      )
        a +=
          s(o[r++]) +
          "," +
          s(o[r++]) +
          " " +
          s(o[r++]) +
          "," +
          s(o[r++]) +
          " " +
          s(o[r++]) +
          "," +
          s(o[r]) +
          " ";
      o.closed && (a += "z");
    }
    return a;
  }
  function y() {
    return n || ("undefined" != typeof window && (n = window.gsap) && n);
  }
  function z(t) {
    return "function" == typeof t;
  }
  function M(t) {
    return console && console.warn(t);
  }
  function P() {
    return String.fromCharCode.apply(null, arguments);
  }
  function S(t) {
    var e,
      n = t.length,
      r = 0,
      o = 0;
    for (e = 0; e < n; e++) (r += t[e++]), (o += t[e]);
    return [r / (n / 2), o / (n / 2)];
  }
  function T(t) {
    var e,
      n,
      r,
      o = t.length,
      a = t[0],
      i = a,
      h = t[1],
      s = h;
    for (r = 6; r < o; r += 6)
      a < (e = t[r]) ? (a = e) : e < i && (i = e),
        h < (n = t[r + 1]) ? (h = n) : n < s && (s = n);
    return (
      (t.centerX = (a + i) / 2),
      (t.centerY = (h + s) / 2),
      (t.size = (a - i) * (h - s))
    );
  }
  function U(t, e) {
    void 0 === e && (e = 3);
    for (
      var n,
        r,
        o,
        a,
        i,
        h,
        s,
        l,
        c,
        g,
        f,
        p,
        u,
        d,
        P,
        _,
        m = t.length,
        w = t[0][0],
        v = w,
        y = t[0][1],
        x = y,
        M = 1 / e;
      -1 < --m;

    )
      for (n = (i = t[m]).length, a = 6; a < n; a += 6)
        for (
          c = i[a],
            g = i[a + 1],
            f = i[a + 2] - c,
            d = i[a + 3] - g,
            p = i[a + 4] - c,
            P = i[a + 5] - g,
            u = i[a + 6] - c,
            _ = i[a + 7] - g,
            h = e;
          -1 < --h;

        )
          w <
          (r =
            ((s = M * h) * s * u + 3 * (l = 1 - s) * (s * p + l * f)) * s + c)
            ? (w = r)
            : r < v && (v = r),
            y < (o = (s * s * _ + 3 * l * (s * P + l * d)) * s + g)
              ? (y = o)
              : o < x && (x = o);
    return (
      (t.centerX = (w + v) / 2),
      (t.centerY = (y + x) / 2),
      (t.left = v),
      (t.width = w - v),
      (t.top = x),
      (t.height = y - x),
      (t.size = (w - v) * (y - x))
    );
  }
  function V(t, e) {
    return e.length - t.length;
  }
  function W(t, e) {
    var n = t.size || T(t),
      r = e.size || T(e);
    return Math.abs(r - n) < (n + r) / 20
      ? e.centerX - t.centerX || e.centerY - t.centerY
      : r - n;
  }
  function X(t, e) {
    var n,
      r,
      o = t.slice(0),
      a = t.length,
      i = a - 2;
    for (e |= 0, n = 0; n < a; n++)
      (r = (n + e) % i), (t[n++] = o[r]), (t[n] = o[1 + r]);
  }
  function Y(t, e, n, r, o) {
    var a,
      i,
      h,
      s,
      l = t.length,
      c = 0,
      g = l - 2;
    for (n *= 6, i = 0; i < l; i += 6)
      (s = t[(a = (i + n) % g)] - (e[i] - r)),
        (h = t[1 + a] - (e[i + 1] - o)),
        (c += w(h * h + s * s));
    return c;
  }
  function Z(t, e, n) {
    var r,
      o,
      a,
      i = t.length,
      h = S(t),
      s = S(e),
      l = s[0] - h[0],
      c = s[1] - h[1],
      g = Y(t, e, 0, l, c),
      f = 0;
    for (a = 6; a < i; a += 6)
      (o = Y(t, e, a / 6, l, c)) < g && ((g = o), (f = a));
    if (n)
      for (reverseSegment((r = t.slice(0))), a = 6; a < i; a += 6)
        (o = Y(r, e, a / 6, l, c)) < g && ((g = o), (f = -a));
    return f / 6;
  }
  function $(t, e, n) {
    for (var r, o, a, i, h, s, l = t.length, c = 1e20, g = 0, f = 0; -1 < --l; )
      for (s = (r = t[l]).length, h = 0; h < s; h += 6)
        (o = r[h] - e),
          (a = r[h + 1] - n),
          (i = w(o * o + a * a)) < c && ((c = i), (g = r[h]), (f = r[h + 1]));
    return [g, f];
  }
  function _(t, e, n, r, o, a) {
    var i,
      h,
      s,
      l,
      c = e.length,
      g = 0,
      f = Math.min(t.size || T(t), e[n].size || T(e[n])) * r,
      p = 1e20,
      u = t.centerX + o,
      d = t.centerY + a;
    for (i = n; i < c && !((e[i].size || T(e[i])) < f); i++)
      (h = e[i].centerX - u),
        (s = e[i].centerY - d),
        (l = w(h * h + s * s)) < p && ((g = i), (p = l));
    return (l = e[g]), e.splice(g, 1), l;
  }
  function aa(t, e) {
    var n,
      r,
      o,
      a,
      i,
      h,
      s,
      l,
      c,
      g,
      f,
      p,
      u,
      d,
      P = 0,
      _ = t.length,
      m = e / ((_ - 2) / 6);
    for (u = 2; u < _; u += 6)
      for (P += m; 0.999999 < P; )
        (n = t[u - 2]),
          (r = t[u - 1]),
          (o = t[u]),
          (a = t[u + 1]),
          (i = t[u + 2]),
          (h = t[u + 3]),
          (s = t[u + 4]),
          (l = t[u + 5]),
          (c = n + (o - n) * (d = 1 / ((Math.floor(P) || 1) + 1))),
          (c += ((f = o + (i - o) * d) - c) * d),
          (f += (i + (s - i) * d - f) * d),
          (g = r + (a - r) * d),
          (g += ((p = a + (h - a) * d) - g) * d),
          (p += (h + (l - h) * d - p) * d),
          t.splice(
            u,
            4,
            n + (o - n) * d,
            r + (a - r) * d,
            c,
            g,
            c + (f - c) * d,
            g + (p - g) * d,
            f,
            p,
            i + (s - i) * d,
            h + (l - h) * d
          ),
          (u += 6),
          (_ += 6),
          P--;
    return t;
  }
  function ba(t, e, n, r, o) {
    var a,
      i,
      h,
      s,
      l,
      c,
      g,
      f = e.length - t.length,
      p = 0 < f ? e : t,
      u = 0 < f ? t : e,
      d = 0,
      P = "complexity" === r ? V : W,
      m = "position" === r ? 0 : "number" == typeof r ? r : 0.8,
      w = u.length,
      v = "object" == typeof n && n.push ? n.slice(0) : [n],
      y = "reverse" === v[0] || v[0] < 0,
      x = "log" === n;
    if (u[0]) {
      if (
        1 < p.length &&
        (t.sort(P),
        e.sort(P),
        p.size || U(p),
        u.size || U(u),
        (c = p.centerX - u.centerX),
        (g = p.centerY - u.centerY),
        P === W)
      )
        for (w = 0; w < u.length; w++) p.splice(w, 0, _(u[w], p, w, m, c, g));
      if (f)
        for (
          f < 0 && (f = -f),
            p[0].length > u[0].length &&
              aa(u[0], ((p[0].length - u[0].length) / 6) | 0),
            w = u.length;
          d < f;

        )
          p[w].size || T(p[w]),
            (s = (h = $(u, p[w].centerX, p[w].centerY))[0]),
            (l = h[1]),
            (u[w++] = [s, l, s, l, s, l, s, l]),
            (u.totalPoints += 8),
            d++;
      for (w = 0; w < t.length; w++)
        (a = e[w]),
          (i = t[w]),
          (f = a.length - i.length) < 0
            ? aa(a, (-f / 6) | 0)
            : 0 < f && aa(i, (f / 6) | 0),
          y && !1 !== o && !i.reversed && reverseSegment(i),
          (n = v[w] || 0 === v[w] ? v[w] : "auto") &&
            (i.closed ||
            (Math.abs(i[0] - i[i.length - 2]) < 0.5 &&
              Math.abs(i[1] - i[i.length - 1]) < 0.5)
              ? "auto" === n || "log" === n
                ? ((v[w] = n = Z(i, a, !w || !1 === o)),
                  n < 0 && ((y = !0), reverseSegment(i), (n = -n)),
                  X(i, 6 * n))
                : "reverse" !== n &&
                  (w && n < 0 && reverseSegment(i), X(i, 6 * (n < 0 ? -n : n)))
              : !y &&
                (("auto" === n &&
                  Math.abs(a[0] - i[0]) +
                    Math.abs(a[1] - i[1]) +
                    Math.abs(a[a.length - 2] - i[i.length - 2]) +
                    Math.abs(a[a.length - 1] - i[i.length - 1]) >
                    Math.abs(a[0] - i[i.length - 2]) +
                      Math.abs(a[1] - i[i.length - 1]) +
                      Math.abs(a[a.length - 2] - i[0]) +
                      Math.abs(a[a.length - 1] - i[1])) ||
                  n % 2)
              ? (reverseSegment(i), (v[w] = -1), (y = !0))
              : "auto" === n
              ? (v[w] = 0)
              : "reverse" === n && (v[w] = -1),
            i.closed !== a.closed && (i.closed = a.closed = !1));
      return x && M("shapeIndex:[" + v.join(",") + "]"), (t.shapeIndex = v);
    }
  }
  function ca(t, e, n, r, o) {
    var a = stringToRawPath(t[0]),
      i = stringToRawPath(t[1]);
    ba(a, i, e || 0 === e ? e : "auto", n, o) &&
      ((t[0] = rawPathToString(a)),
      (t[1] = rawPathToString(i)),
      ("log" !== r && !0 !== r) ||
        M('precompile:["' + t[0] + '","' + t[1] + '"]'));
  }
  function ea(t, e) {
    var n,
      r,
      o,
      a,
      i,
      h,
      s,
      l = 0,
      c = parseFloat(t[0]),
      g = parseFloat(t[1]),
      f = c + "," + g + " ";
    for (n = (0.5 * e) / (0.5 * (o = t.length) - 1), r = 0; r < o - 2; r += 2) {
      if (
        ((l += n),
        (h = parseFloat(t[r + 2])),
        (s = parseFloat(t[r + 3])),
        0.999999 < l)
      )
        for (i = 1 / (Math.floor(l) + 1), a = 1; 0.999999 < l; )
          (f +=
            (c + (h - c) * i * a).toFixed(2) +
            "," +
            (g + (s - g) * i * a).toFixed(2) +
            " "),
            l--,
            a++;
      (f += h + "," + s + " "), (c = h), (g = s);
    }
    return f;
  }
  function fa(t) {
    var e = t[0].match(L) || [],
      n = t[1].match(L) || [],
      r = n.length - e.length;
    0 < r ? (t[0] = ea(e, r)) : (t[1] = ea(n, -r));
  }
  function ga(e) {
    return isNaN(e)
      ? fa
      : function (t) {
          fa(t),
            (t[1] = (function _offsetPoints(t, e) {
              if (!e) return t;
              var n,
                r,
                o,
                a = t.match(L) || [],
                i = a.length,
                h = "";
              for (
                n =
                  "reverse" === e
                    ? ((r = i - 1), -2)
                    : ((r = (2 * (parseInt(e, 10) || 0) + 1 + 100 * i) % i), 2),
                  o = 0;
                o < i;
                o += 2
              )
                (h += a[r - 1] + "," + a[r] + " "), (r = (r + n) % i);
              return h;
            })(t[1], parseInt(e, 10)));
        };
  }
  function ia(t, e) {
    for (
      var n, r, o, a, i, h, s, l, c, g, f, p, u = t.length, d = 0.2 * (e || 1);
      -1 < --u;

    ) {
      for (
        f = (r = t[u]).isSmooth = r.isSmooth || [0, 0, 0, 0],
          p = r.smoothData = r.smoothData || [0, 0, 0, 0],
          f.length = 4,
          l = r.length - 2,
          s = 6;
        s < l;
        s += 6
      )
        (o = r[s] - r[s - 2]),
          (a = r[s + 1] - r[s - 1]),
          (i = r[s + 2] - r[s]),
          (h = r[s + 3] - r[s + 1]),
          (c = v(a, o)),
          (g = v(h, i)),
          (n = Math.abs(c - g) < d) &&
            ((p[s - 2] = c),
            (p[s + 2] = g),
            (p[s - 1] = w(o * o + a * a)),
            (p[s + 3] = w(i * i + h * h))),
          f.push(n, n, 0, 0, n, n);
      r[l] === r[0] &&
        r[1 + l] === r[1] &&
        ((o = r[0] - r[l - 2]),
        (a = r[1] - r[l - 1]),
        (i = r[2] - r[0]),
        (h = r[3] - r[1]),
        (c = v(a, o)),
        (g = v(h, i)),
        Math.abs(c - g) < d &&
          ((p[l - 2] = c),
          (p[2] = g),
          (p[l - 1] = w(o * o + a * a)),
          (p[3] = w(i * i + h * h)),
          (f[l - 2] = f[l - 1] = !0)));
    }
    return t;
  }
  function ja(t) {
    var e = t.trim().split(" ");
    return {
      x:
        (~t.indexOf("left")
          ? 0
          : ~t.indexOf("right")
          ? 100
          : isNaN(parseFloat(e[0]))
          ? 50
          : parseFloat(e[0])) / 100,
      y:
        (~t.indexOf("top")
          ? 0
          : ~t.indexOf("bottom")
          ? 100
          : isNaN(parseFloat(e[1]))
          ? 50
          : parseFloat(e[1])) / 100,
    };
  }
  function ma(t, e, n, r) {
    var o,
      a,
      i = this._origin,
      h = this._eOrigin,
      s = t[n] - i.x,
      l = t[n + 1] - i.y,
      c = w(s * s + l * l),
      g = v(l, s);
    return (
      (s = e[n] - h.x),
      (l = e[n + 1] - h.y),
      (a = (function _shortAngle(t) {
        return t !== t % f ? t + (t < 0 ? p : -p) : t;
      })((o = v(l, s) - g))),
      !r && I && Math.abs(a + I.ca) < u && (r = I),
      (this._anchorPT = I =
        {
          _next: this._anchorPT,
          t: t,
          sa: g,
          ca: r && a * r.ca < 0 && Math.abs(a) > d ? o : a,
          sl: c,
          cl: w(s * s + l * l) - c,
          i: n,
        })
    );
  }
  function na(t) {
    (n = y()),
      (o = o || (n && n.plugins.morphSVG)),
      n && o
        ? ((j = n.utils.toArray), (o.prototype._tweenRotation = ma), (F = 1))
        : t && M("Please gsap.registerPlugin(MorphSVGPlugin)");
  }
  var n,
    j,
    I,
    F,
    o,
    v = Math.atan2,
    x = Math.cos,
    O = Math.sin,
    w = Math.sqrt,
    f = Math.PI,
    p = 2 * f,
    u = 0.3 * f,
    d = 0.7 * f,
    L = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
    G = /(^[#\.][a-z]|[a-y][a-z])/i,
    q = /[achlmqstvz]/i,
    a = "MorphSVGPlugin",
    i = P(103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109),
    K = {
      version: "3.6.1",
      name: "morphSVG",
      rawVars: 1,
      register: function register(t, e) {
        return true;
        // (n = t), (o = e), na();
      },
      init: function init(t, e, n, r, o) {
        if ((F || na(1), !e)) return M("invalid shape"), !1;
        var a, i, h, s, l, c, g, f, p, u, d, P, _, m, w, v, y, x, T, b, S, N;
        if (
          (z(e) && (e = e.call(n, r, t, o)),
          "string" == typeof e || e.getBBox || e[0])
        )
          e = { shape: e };
        else if ("object" == typeof e) {
          for (i in ((a = {}), e))
            a[i] = z(e[i]) && "render" !== i ? e[i].call(n, r, t, o) : e[i];
          e = a;
        }
        var A = t.nodeType ? window.getComputedStyle(t) : {},
          R = A.fill + "",
          O = !(
            "none" === R ||
            "0" === (R.match(L) || [])[3] ||
            "evenodd" === A.fillRule
          ),
          C = (e.origin || "50 50").split(",");
        if (
          ((l =
            "POLYLINE" === (a = (t.nodeName + "").toUpperCase()) ||
            "POLYGON" === a),
          "PATH" !== a && !l && !e.prop)
        )
          return M("Cannot morph a <" + a + "> element. " + B), !1;
        if (
          ((i = "PATH" === a ? "d" : "points"), !e.prop && !z(t.setAttribute))
        )
          return !1;
        if (
          ((s = (function _parseShape(t, e, n) {
            var r, o;
            return (
              (!("string" == typeof t) ||
                G.test(t) ||
                (t.match(L) || []).length < 3) &&
                ((r = j(t)[0])
                  ? ((o = (r.nodeName + "").toUpperCase()),
                    e &&
                      "PATH" !== o &&
                      ((r = convertToPath(r, !1)), (o = "PATH")),
                    (t = r.getAttribute("PATH" === o ? "d" : "points") || ""),
                    r === n &&
                      (t = r.getAttributeNS(null, "data-original") || t))
                  : (M("WARNING: invalid morph to: " + t), (t = !1))),
              t
            );
          })(e.shape || e.d || e.points || "", "d" === i, t)),
          l && q.test(s))
        )
          return M("A <" + a + "> cannot accept path data. " + B), !1;
        if (
          ((c = e.shapeIndex || 0 === e.shapeIndex ? e.shapeIndex : "auto"),
          (g = e.map || K.defaultMap),
          (this._prop = e.prop),
          (this._render = e.render || K.defaultRender),
          (this._apply =
            "updateTarget" in e ? e.updateTarget : K.defaultUpdateTarget),
          (this._rnd = Math.pow(10, isNaN(e.precision) ? 2 : +e.precision)),
          (this._tween = n),
          s)
        ) {
          if (
            ((this._target = t),
            (y = "object" == typeof e.precompile),
            (u = this._prop ? t[this._prop] : t.getAttribute(i)),
            this._prop ||
              t.getAttributeNS(null, "data-original") ||
              t.setAttributeNS(null, "data-original", u),
            "d" === i || this._prop)
          ) {
            if (
              ((u = stringToRawPath(y ? e.precompile[0] : u)),
              (d = stringToRawPath(y ? e.precompile[1] : s)),
              !y && !ba(u, d, c, g, O))
            )
              return !1;
            for (
              ("log" !== e.precompile && !0 !== e.precompile) ||
                M(
                  'precompile:["' +
                    rawPathToString(u) +
                    '","' +
                    rawPathToString(d) +
                    '"]'
                ),
                (S = "linear" !== (e.type || K.defaultType)) &&
                  ((u = ia(u, e.smoothTolerance)),
                  (d = ia(d, e.smoothTolerance)),
                  u.size || U(u),
                  d.size || U(d),
                  (b = ja(C[0])),
                  (this._origin = u.origin =
                    { x: u.left + b.x * u.width, y: u.top + b.y * u.height }),
                  C[1] && (b = ja(C[1])),
                  (this._eOrigin = {
                    x: d.left + b.x * d.width,
                    y: d.top + b.y * d.height,
                  })),
                this._rawPath = t._gsRawPath = u,
                _ = u.length;
              -1 < --_;

            )
              for (
                w = u[_],
                  v = d[_],
                  f = w.isSmooth || [],
                  p = v.isSmooth || [],
                  m = w.length,
                  P = I = 0;
                P < m;
                P += 2
              )
                (v[P] === w[P] && v[P + 1] === w[P + 1]) ||
                  (S
                    ? f[P] && p[P]
                      ? ((x = w.smoothData),
                        (T = v.smoothData),
                        (N = P + (P === m - 4 ? 7 - m : 5)),
                        (this._controlPT = {
                          _next: this._controlPT,
                          i: P,
                          j: _,
                          l1s: x[P + 1],
                          l1c: T[P + 1] - x[P + 1],
                          l2s: x[N],
                          l2c: T[N] - x[N],
                        }),
                        (h = this._tweenRotation(w, v, P + 2)),
                        this._tweenRotation(w, v, P, h),
                        this._tweenRotation(w, v, N - 1, h),
                        (P += 4))
                      : this._tweenRotation(w, v, P)
                    : ((h = this.add(w, P, w[P], v[P])),
                      (h = this.add(w, P + 1, w[P + 1], v[P + 1]) || h)));
          } else
            h = this.add(
              t,
              "setAttribute",
              t.getAttribute(i) + "",
              s + "",
              r,
              o,
              0,
              ga(c),
              i
            );
          S &&
            (this.add(this._origin, "x", this._origin.x, this._eOrigin.x),
            (h = this.add(this._origin, "y", this._origin.y, this._eOrigin.y))),
            h && (this._props.push("morphSVG"), (h.end = s), (h.endProp = i));
        }
      },
      render: function render(t, e) {
        for (
          var n,
            r,
            o,
            a,
            i,
            h,
            s,
            l,
            c,
            g,
            f,
            p,
            u = e._rawPath,
            d = e._controlPT,
            P = e._anchorPT,
            _ = e._rnd,
            m = e._target,
            w = e._pt;
          w;

        )
          w.r(t, w.d), (w = w._next);
        if (1 === t && e._apply)
          for (w = e._pt; w; )
            w.end &&
              (e._prop
                ? (m[e._prop] = w.end)
                : m.setAttribute(w.endProp, w.end)),
              (w = w._next);
        else if (u) {
          for (; P; )
            (i = P.sa + t * P.ca),
              (a = P.sl + t * P.cl),
              (P.t[P.i] = e._origin.x + x(i) * a),
              (P.t[P.i + 1] = e._origin.y + O(i) * a),
              (P = P._next);
          for (r = t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1; d; )
            (p =
              (h = d.i) + (h === (o = u[d.j]).length - 4 ? 7 - o.length : 5)),
              (i = v(o[p] - o[h + 1], o[p - 1] - o[h])),
              (g = O(i)),
              (f = x(i)),
              (l = o[h + 2]),
              (c = o[h + 3]),
              (a = d.l1s + r * d.l1c),
              (o[h] = l - f * a),
              (o[h + 1] = c - g * a),
              (a = d.l2s + r * d.l2c),
              (o[p - 1] = l + f * a),
              (o[p] = c + g * a),
              (d = d._next);
          if (((m._gsRawPath = u), e._apply)) {
            for (n = "", s = 0; s < u.length; s++)
              for (
                a = (o = u[s]).length,
                  n +=
                    "M" +
                    ((o[0] * _) | 0) / _ +
                    " " +
                    ((o[1] * _) | 0) / _ +
                    " C",
                  h = 2;
                h < a;
                h++
              )
                n += ((o[h] * _) | 0) / _ + " ";
            e._prop ? (m[e._prop] = n) : m.setAttribute("d", n);
          }
        }
        e._render && u && e._render.call(e._tween, u, m);
      },
      kill: function kill() {
        this._pt = this._rawPath = 0;
      },
      getRawPath: function getRawPath(t) {
        var e,
          n = (t = (m(t) && r.test(t) && document.querySelector(t)) || t)
            .getAttribute
            ? t
            : 0;
        return n && (t = t.getAttribute("d"))
          ? (n._gsPath || (n._gsPath = {}),
            (e = n._gsPath[t]) && !e._dirty
              ? e
              : (n._gsPath[t] = stringToRawPath(t)))
          : t
          ? m(t)
            ? stringToRawPath(t)
            : h(t[0])
            ? [t]
            : t
          : console.warn(
              "Expecting a <path> element or an SVG path data string"
            );
      },
      stringToRawPath: stringToRawPath,
      rawPathToString: rawPathToString,
      normalizeStrings: function normalizeStrings(t, e, n) {
        var r = n.shapeIndex,
          o = n.map,
          a = [t, e];
        return ca(a, r, o), a;
      },
      pathFilter: ca,
      pointsFilter: fa,
      getTotalSize: U,
      equalizeSegmentQuantity: ba,
      convertToPath: function convertToPath$1(t, e) {
        return j(t).map(function (t) {
          return convertToPath(t, !1 !== e);
        });
      },
      defaultType: "linear",
      defaultUpdateTarget: !0,
      defaultMap: "size",
    };
  y() && n.registerPlugin(K), (t.MorphSVGPlugin = K), (t.default = K);
  if (typeof window === "undefined" || window !== t) {
    Object.defineProperty(t, "__esModule", { value: !0 });
  } else {
    delete t.default;
  }
});
