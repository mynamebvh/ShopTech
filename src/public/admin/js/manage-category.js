function updateData() {
  $('#file-datatable').DataTable().ajax.reload();
}

const loadCategorys = () => {
  const api = '/api/v1/categorys';
  var table = $('#file-datatable').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: api,
      dataSrc: function (json) {
        json.data.forEach((element) => {
          element.method = ` 
					<button type="button" class="btn btn-primary" id="btnEdit" data-bs-toggle="modal" data-bs-target="#update-modal"><i class="fa fa-edit"></i> Sửa</button>
																					
					<button type="button" class="btn btn-secondary" id="btnDelete" data-bs-toggle="modal" data-bs-target="#modaldemo2"><i class="fa fa-trash"></i></i> Xoá</button>`;
        });

        return json.data;
      },
    },

    columns: [
      { data: null, defaultContent: '', className: 'sttColumn' },
      {
        data: 'name',
      },
      { data: 'desc' },
      { data: 'slug' },

      { data: 'method' },
    ],
    columnDefs: [
      {
        targets: 2,
        width: '10%',
        render: function (data, type, row) {
          return data.substr(0, 50) + '...';
        },
      },
      {
        targets: 4,
        width: '10%',
      },
    ],
    fnRowCallback: function (nRow, aData, iDisplayIndex) {
      var oSettings = this.fnSettings();
      $('td:first', nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
      return nRow;
    },
    buttons: ['copy', 'excel', 'pdf', 'colvis'],
    // responsive: true,
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

const addCategory = () => {
  try {
    $('#btn-create-category').on('click', async () => {
      const name = $('#name').val();
      const desc = $('#desc').val();

      const response = await fetch('/api/v1/categorys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, desc }),
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

const deleteCategory = () => {
  let category;
  $('#file-datatable tbody').on('click', 'button#btnDelete', function () {
    category = $('#file-datatable').DataTable().row($(this).parents('tr')).data();
  });

  $('#delete').on('click', async function () {
    const response = await fetch(`/api/v1/categorys/${category.id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.code == 200) {
      $('#modaldemo2').modal('hide');
      notif({
        msg: 'Xoá thành công',
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

const updateCategory = () => {
  let category;
  $('#file-datatable tbody').on('click', 'button#btnEdit', function () {
    category = $('#file-datatable').DataTable().row($(this).parents('tr')).data();

    // TODO: Fill teacher data to form update
    $('#nameUpdate').val(category.name);
    $('#descUpdate').val(category.desc);
  });

  // TODO: Handle submit update user
  $('#btn-update-category').on('click', async function () {
    const dataUpdate = {
      name: $('#nameUpdate').val(),
      desc: $('#descUpdate').val(),
    };

    try {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataUpdate),
      };

      const response = await fetch(`/api/v1/categorys/${category.id}`, requestOptions);
      const data = await response.json();

      console.log('RESPONSE', data);

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
  loadCategorys();
  addCategory();
  deleteCategory();
  updateCategory();
});
