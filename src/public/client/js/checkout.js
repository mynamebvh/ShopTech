const renderOption = async (idSelect, type, api) => {
  let data;

  switch (type) {
    case 'city':
      data = await (await fetch(api)).json();
      break;
    case 'district':
      data = (await (await fetch(api)).json()).districts;
      break;
    case 'ward':
      data = (await (await fetch(api)).json()).wards;
      break;
    default:
      break;
  }

  let options = data.map((c) => {
    return `<option value="${c.code}">${c.name}</option>`;
  });

  if (type != 'city') {
    options.splice(0, 1);
  }

  if (type == 'city') {
    options.unshift('<option value="0">Chọn thành phố</option>');
  }

  if (type == 'district') {
    options.unshift('<option value="0">Chọn quận huyện</option>');
  }

  document.getElementById(idSelect).innerHTML = options.join('');
};

const emptySelect = (id) => {
  document.getElementById(id).innerHTML = '';
};

const renderCheckoutByLocalStorage = () => {
  let data = localStorage.getItem('techCard');

  let listProduct = '';

  if (Array.isArray(JSON.parse(data))) {
    data = JSON.parse(data);

    data.forEach((e) => {
      let htmlProduct = `<div class="col-sm-12 mb-6">
      <div class="ec-product-inner">
         <div class="ec-pro-image-outer">
            <div class="ec-pro-image">
               <a href="product-left-sidebar.html" class="image">
               <img class="main-image" src="${e.img}" alt="Product">
               <img class="hover-image" src="${e.img}" alt="Product">
               </a>
               <div class="ec-pro-loader"></div>
               <div class="ec-pro-loader"></div>
            </div>
         </div>
         <div class="ec-pro-content">
            <h5 class="ec-pro-title"><a href="product-left-sidebar.html">${e.name}</a></h5>
            <div class="ec-pro-rating">
               <i class="ecicon eci-star fill"></i>
               <i class="ecicon eci-star fill"></i>
               <i class="ecicon eci-star fill"></i>
               <i class="ecicon eci-star fill"></i>
               <i class="ecicon eci-star"></i>
            </div>
            <span class="ec-price">
            <span class="new-price">${e.price} VND x ${e.quantity}</span>
            </span>
         </div>
      </div>
   </div>`;
      listProduct += htmlProduct;
    });
  }

  return listProduct;
};

const renderPriceCheckout = () => {
  const [tPrice, vat, total] = calculatorPrice();

  document.getElementById('c-price').textContent = tPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  document.getElementById('c-vat').textContent = vat.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  document.getElementById('c-total').textContent = total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
};

const submitForm = () => {
  const order = document.getElementById('order');

  order.addEventListener('click', async () => {
    const fullname = document.getElementById('fullname').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const phone = document.getElementById('phone').value;

    const city = $('#ec-select-city option:selected').text();
    const district = $('#ec-select-district option:selected').text();
    const ward = $('#ec-select-ward option:selected').text();

    try {
      const data = await (
        await fetch('/api/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullname,
            customerAddress,
            city,
            phone,
            district,
            ward,
            products: JSON.parse(localStorage.getItem('techCard')),
          }),
        })
      ).json();
    } catch (error) {
      console.log(error);
    }
  });
};

document.addEventListener('DOMContentLoaded', async function () {
  // Logic don vi hanh chinh
  let idCity, idDistrict;
  const selectCity = document.getElementById('ec-select-city');

  await renderOption('ec-select-city', 'city', 'https://provinces.open-api.vn/api/p/');

  selectCity.addEventListener('change', async ({ target }) => {
    idCity = target.value;
    emptySelect('ec-select-ward');
    emptySelect('ec-select-district');

    await renderOption('ec-select-district', 'district', `https://provinces.open-api.vn/api/p/${idCity}?depth=2`);
  });

  document.getElementById('ec-select-district').addEventListener('change', async ({ target }) => {
    idDistrict = target.value;
    emptySelect('ec-select-ward');

    await renderOption('ec-select-ward', 'ward', `https://provinces.open-api.vn/api/d/${idDistrict}?depth=2`);
  });

  // render product by localstorage
  document.querySelector('.ec-checkout-pro').innerHTML = renderCheckoutByLocalStorage();

  renderPriceCheckout();

  submitForm();
});
