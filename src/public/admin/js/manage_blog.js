function updateData() {
  $('#file-datatable').DataTable().ajax.reload();
}

const loadUsers = () => {
  const api = '/api/v1/posts?sortBy=createdAt:desc';
  var table = $('#file-datatable').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: api,
      dataSrc: function (json) {
        json.data.forEach((element) => {
          element.method = `
          <a href="/admin/manage-blog/edit/${element.id}">
            <button type="button" class="btn btn-primary"><i class="fa fa-edit"></i> Sửa</button>
          </a>
					
																					
					<button type="button" class="btn btn-secondary" id="btnDelete" data-bs-toggle="modal" data-bs-target="#modaldemo2"><i class="fa fa-trash"></i></i> Xoá</button>`;
        });

        return json.data;
      },
    },

    columns: [
      { data: null, defaultContent: '', className: 'sttColumn' },
      {
        data: 'thumbnail',
        render: function (data, type, row) {
          return `<img src="${data}" width="100" height="100">`;
        },
      },
      {
        data: 'title',
        render: function (data, type, row) {
          console.log(data.length);
          if (data.length <= 30) return data;
          return data.substring(0, 30) + '...';
        },
      },
      {
        data: 'user',
        render: function (data, type, row) {
          return data.firstName + ' ' + data.lastName;
        },
      },

      {
        data: "createdAt",
        render: function (data, type, row) {
          return dayjs(data).fromNow();
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return 'Đã đăng';
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
        targets: 1,
        width: '10%',
      },
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


const deletePost = () => {
  $('#file-datatable tbody').on('click', 'button#btnDelete', function () {
    const post = $('#file-datatable').DataTable().row($(this).parents('tr')).data();

    $('#lock').on('click', async function () {
      const response = await fetch(`/api/v1/posts/${post.id}`, {
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
  });
};


$(document).ready(function () {
  loadUsers();
  deletePost()
});
