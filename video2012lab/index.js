(function (api) {
  var hooks = [];
  var attempts = 0;
  var successes = 0;
  var names = ["setAv1Enabled", "setHevcEnabled", "setH265Enabled"];
  function log(message) {
    try {
      if (api && api.plugin && api.plugin.logger && typeof api.plugin.logger.log === "function") {
        api.plugin.logger.log("[Video2012] " + message);
        return;
      }
    } catch (_) {}
    try { console.log("[Video2012] " + message); } catch (_) {}
  }
  function resolve(name) {
    try {
      if (!api || !api.metro) return null;
      var metro = api.metro;
      if (typeof metro.findByProps === "function") return metro.findByProps(name);
      if (typeof metro.byProps === "function") return metro.byProps(name);
      if (metro.finders && typeof metro.finders.findByProps === "function") return metro.finders.findByProps(name);
    } catch (error) { log("Lookup failed for " + name + ": " + String(error)); }
    return null;
  }
  function start() {
    log("Started. Sending/receiving H264/HEVC/AV1 video still depends on native WebRTC.");
    if (hooks.length) return;
    attempts = 0;
    successes = 0;
    names.forEach(function (name) {
      attempts++;
      var owner = resolve(name);
      if (!owner || typeof owner[name] !== "function") { log(name + ": unavailable in this Discord build"); return; }
      var original = owner[name];
      var wrapper = function () {
        var args = Array.prototype.slice.call(arguments);
        if (args.length > 0 && typeof args[0] === "boolean") args[0] = false;
        return original.apply(this, args);
      };
      try {
        owner[name] = wrapper;
        if (owner[name] !== wrapper) { log(name + ": read-only, not patched"); return; }
        hooks.push({owner:owner, name:name, original:original, wrapper:wrapper});
        // Don't invoke the setter immediately: its original signature is not verified.
        successes++;
        log(name + ": future boolean-enable calls will be forced OFF");
      } catch (error) { log(name + ": patch failed: " + String(error)); }
    });
    log("Diagnostic result: " + successes + "/" + attempts + " JS codec switches hooked. If 0, this plugin cannot change codec behavior here.");
  }
  function stop() {
    hooks.forEach(function (hook) {
      try { if (hook.owner[hook.name] === hook.wrapper) hook.owner[hook.name] = hook.original; }
      catch (_) {}
    });
    hooks = [];
    log("Stopped. Reload Discord to ensure full rollback.");
  }
  return { onLoad:start, onUnload:stop };
})(typeof vendetta !== "undefined" ? vendetta : (typeof bunny !== "undefined" ? bunny : undefined))
