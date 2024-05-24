var a = new Date().toLocaleString("en-US", { timeZone: "Asia/Calcutta" }).toString().split(",")[0].replace(/\//g, (x) => "-");

console.log(a);