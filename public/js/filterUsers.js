const btnFilterUser = document.getElementById('btnFilterUser')
const username = document.getElementById('filterUsername')
const email = document.getElementById('filterEmail')
const firstName = document.getElementById('filterFirstName')
const lastName = document.getElementById('filterLastName')
const active = document.getElementById('filterActive')
const bodyUsersTable = document.getElementById('bodyUsersTable')

btnFilterUser.onclick = () => {
    let filterUsername = username.value;
    let filterEmail = email.value;
    let filterFirstName = firstName.value;
    let filterLastName = lastName.value;
    let filterActive = active.value;
    let filter = {}
    if (filterActive != ""){
        let isActive = (filterActive === 'true')
        filter.isActive = isActive
    }
    $.getJSON('/api/all-users', {}, (data) => {
        let users = [];
        data.forEach(user => {
            if (filterActive != ""){
                let filterActiveValue = (filterActive === 'true')
                if (user.isActive !== filterActiveValue) {
                    return;
                }
            }
            if (filterUsername != "") {
                if (!user.username.includes(filterUsername)) {
                    return;
                }
            }
            if (filterEmail != "") {
                if (!user.email.includes(filterEmail)) {
                    return;
                }
            }
            if (filterFirstName != "") {
                if (!user.firstName.includes(filterFirstName)) {
                    return;
                }
            }
            if (filterLastName != "") {
                if (!user.lastName.includes(filterLastName)) {
                    return;
                }
            }
            users.push(user);
        });

        let table = $('#usersTable').DataTable();
        table.destroy();
        table.draw();

        bodyUsersTable.innerHTML = ''
        users.forEach(user => {
            let stringHTML = `
            <tr>
              <td>`+ user.username + `</td>
              <td>`+ user.email + `</td>`;
            if (user.firstName !== undefined){
                stringHTML += `<td>`+ user.firstName + `</td>`
            } else {
                stringHTML += `<td></td>`
            }
            if (user.lastName !== undefined){
                stringHTML += `<td>`+ user.lastName + `</td>`
            } else {
                stringHTML += `<td></td>`
            }
            stringHTML += `
              <td>
                <div class="d-flex justify-content-center">`;
            if (user.isActive){
                stringHTML += 
                `<button type="button" class="btn btn-success" data-toggle="modal" data-target="#activeModal"
                    data-id=`+ user._id +` data-username=`+user.username+` data-email=`+ user.email +` data-isactive="`+ user.isActive+`">
                    Active
                </button>`
            } else {
                stringHTML += 
                `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#activeModal"
                    data-id=`+ user._id + ` data-username=`+user.username+` data-email=`+user.email+` data-isactive="`+user.isActive+`">
                    Blocked
                </button>`
            }
            stringHTML += `
                </div>
              </td>
              <td>
                <button type="button" class="btn btn-link" data-toggle="modal" data-target="#detailModal"
                  data-id=`+user._id+` data-username=`+user.username+` data-email=`+user.email+` data-firstname="`+user.firstName+`"
                  data-lastname="`+user.lastName+`" data-more="`+user.more+`" data-phonenumber="`+user.phoneNumber+`"
                  data-isactive="`+user.isActive+`">
                  Detail
                </button>
              </td>
            </tr>`
            bodyUsersTable.insertAdjacentHTML('beforeend', stringHTML)
        });

        $(document).ready(function () {
            $('#usersTable').DataTable();
        });
    });
}