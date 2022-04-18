(() => {
  data = [
    {
      s: "the interests of authors",
      k: "creators",
    },
    {
      s: "A large number of texts",
      k: "images",
    },
    {
      s: "Copyright law protects the interests of authors",
      k: "creators"
    },
    {
      s: "A large number of texts",
      k: "images"
    },
    {
      s: "The academic must check the terms of publishing contracts carefully.",
      k: "authors"
    }
  ];

  let btn = `<div id="eop">
<input
  type="text"
  name=""
  id="eop"
  style="
    all: unset;
    border: 1px solid #e7e7e7;
    height: 23px;
    width: 229px;
    "
    />
    </div>`;

  const btnDel = document.getElementById("eop");
  document.querySelector("body").insertAdjacentHTML("afterend", btn);

  document.querySelector("#eop").addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
      const result = data
        .filter((k) => k.s.includes(e.target.value))
        .map((r) => `${r.s} - ${r.k}`)
        .join(" | ");
      console.log(result);

      if (document.getElementById("result")) {
        document.getElementById("result").remove();
      }

      const divResult = `<div id="result">
                          ${result} 
                        </div>`;
      document.querySelector("body").insertAdjacentHTML("afterend", divResult);

      e.target.value = "";
    }

    if (e.keyCode == 16) {
      document.getElementById("eop").remove();
      document.getElementById("result").remove();
    }
  });
})();
