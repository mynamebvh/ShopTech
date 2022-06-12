function updateData() {
  $('#file-datatable').DataTable().ajax.reload();
}

const loadVouchers = () => {
  const api = '/api/v1/vouchers?sortBy=createdAt:desc';
  var table = $('#file-datatable').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: api,
      dataSrc: function (json) {
        console.log(json.data);

        const result = json.data.map((data) => {
          let method = null;
          
            method = ` 
            <button type="button" class="btn btn-primary" id="btnEdit" data-bs-toggle="modal" data-bs-target="#update-modal"><i class="fa fa-edit"></i> Sửa</button>
                                            
            <button type="button" class="btn btn-secondary" id="btnDelete" data-bs-toggle="modal" data-bs-target="#modaldemo2"><i class="fas fa-eye-slash"></i></i> Xoá</button>`;
          return { ...data, method };
        });

        return result;
      },
    },

    columns: [
      { data: null, defaultContent: '', className: 'sttColumn' },
      {
        data: 'name',
      },
      { data: 'desc' },
      { data: 'code' },

      {
        data: 'timeStart',
        render: function (data, type, row) {
          return dayjs(data).format('DD/MM/YYYY');
        },
      },
      {
        data: 'timeEnd',
        render: function (data, type, row) {
          return dayjs(data).format('DD/MM/YYYY');
        },
      },
      { data: 'method' },
    ],
    columnDefs: [
      // {
      //   targets: 2,
      //   width: '5%',
      //   render: function (data, type, row) {
      //     return data.substr(0, 30) + '...';
      //   },
      // },
      {
        targets: 6,
        width: '10%',
      },
    ],
    fnRowCallback: function (nRow, aData, iDisplayIndex) {
      var oSettings = this.fnSettings();
      $('td:first', nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
      return nRow;
    },

    language: {
      sProcessing: 'Đang xử lý...',
      sLengthMenu: 'Chọn số bản ghi hiển thị trên một trang _MENU_ bản ghi',
      sZeroRecords: 'Không có dữ liệu để hiển thị.',
      sInfo: 'Hiển thị từ _START_ đến _END_ trong tổng số _TOTAL_',
      sInfoEmpty: 'Hiển thị từ 0 đến 0 trong tổng số 0 mục',
      sInfoFiltered: '(được lọc từ _MAX_ bản ghi)',
      sInfoPostFix: '',
      sSearch: 'Tìm kiếm:',
      sUrl: '',
      oPaginate: {
        sFirst: 'Đầu',
        sPrevious: 'Trước',
        sNext: 'Tiếp',
        sLast: 'Cuối',
      },
    },
  });
};

const createVoucher = () => {
  try {
    $('#btn-create-voucher').on('click', async () => {
      const name = $('#name').val();
      const desc = $('#desc').val();
      const type = $('#type').val();
      const timeStart = $('#time-start').val();
      const timeEnd = $('#time-end').val();
      const discount = $('#discount').val();
      const max = $('#max').val();
      const quantity = $('#quantity').val();


      const response = await fetch('/api/v1/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, desc, type,timeStart, timeEnd, discount,max, quantity}),
      });

      const data = await response.json();

      if (data.code == 201) {
        updateData();
        $('#close-1').click();
        notif({
          msg: 'Tạo thành công',
          position: 'right',
          bottom: '10',
        });
        return;
      }

      if (data.code == 400) {
        notif({
          msg: data.message,
          type: 'error',
          position: 'right',
          zindex: 99999999,
        });
        return;
      }

      console.log(response);
    });
  } catch (error) {
    console.log('error');
    notif({
      msg: error,
      type: 'error',
      position: 'right',
      zindex: 99999999,
    });
  }
};

const deleteVoucher = () => {
  let voucher;
  $('#file-datatable tbody').on('click', 'button#btnDelete', function () {
    voucher = $('#file-datatable').DataTable().row($(this).parents('tr')).data();
  });

  console.log(voucher)
  $('#lock').on('click', async function () {
    const response = await fetch(`/api/v1/vouchers/${voucher.id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.code == 200) {
      $('#modaldemo2').modal('hide');
      notif({
        msg: 'Thành công',
        position: 'right',
        bottom: '10',
      });
      updateData();
      return;
    }

    if (data.message) {
      notif({
        type: 'error',
        msg: data.message,
        position: 'right',
        bottom: '10',
      });
    }
  });
};

const updateVoucher = () => {
  let voucher;
  $('#file-datatable tbody').on('click', 'button#btnEdit', function () {
    voucher = $('#file-datatable').DataTable().row($(this).parents('tr')).data();

    
    $('#u-name').val(voucher.name);
    $('#u-desc').val(voucher.desc);
    $('#u-type').val(voucher.type);
    $('#u-time-start').val(dayjs(voucher.timeStart).format('DD/MM/YYYY'));
    $('#u-time-end').val(dayjs(voucher.timeEnd).format('DD/MM/YYYY'));
    $('#u-discount').val(voucher.discount);
    $('#u-max').val(voucher.max);
    $('#u-quantity').val(voucher.quantity);

  });

  // TODO: Handle submit update user
  $('#btn-update-user').on('click', async function () {
    const dataUpdate = {
      name: $('#u-name').val(),
      desc: $('#u-desc').val(),
      type: $('#u-type').val(),
      timeStart: $('#u-time-start').val(),
      timeEnd: $('#u-time-end').val(),
      max: $('#u-max').val(),
      discount: $('#u-discount').val(),
      quantity: $('#u-quantity').val(),
    };

    try {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataUpdate),
      };

      const response = await fetch(`/api/v1/vouchers/${voucher.id}`, requestOptions);
      const data = await response.json();

      // console.log('RESPONSE', data);

      if (data.code == 200) {
        $('#update-modal').modal('hide');
        notif({
          msg: 'Sửa thành công',
          position: 'right',
          bottom: '10',
        });
        updateData();
      }

      if (data.code == 400) {
        notif({
          msg: data.message,
          type: 'error',
          position: 'right',
          zindex: 99999999,
        });
      }
    } catch (error) {
      notif({
        msg: error,
        type: 'error',
        position: 'right',
        zindex: 99999999,
      });
    }
  });
};

$(document).ready(function () {
  loadVouchers();
  createVoucher();
  deleteVoucher();
  updateVoucher();
});
