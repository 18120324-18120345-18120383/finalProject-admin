const btnFilterBook = document.getElementById('btnFilterBook')
const category = document.getElementById('filterCategory')
const name = document.getElementById('filterName')
const minPrice = document.getElementById('filterMinPrice')
const maxPrice = document.getElementById('filterMaxPrice')
const bodyBooksTable = document.getElementById('bodyBooksTable')

btnFilterBook.onclick = () => {
    let filterCategory = category.value;
    let filterMaxPrice = maxPrice.value;
    let filterMinPrice = minPrice.value;
    let filterName = name.value;
    const filter = {}
    if (filterCategory != ""){
        filter.category = filterCategory
    }
    if (filterMaxPrice != ""){ //have max price condition
        if (filterMinPrice != ""){ //have max price and min price condition
            filter.basePrice = {
                $gt: filterMinPrice,
                $lt: filterMaxPrice
            }
        } else { //have max price condition and do not have min price condition
            filter.basePrice = {
                $lt: filterMaxPrice
            }
        }
    } else if ( filterMinPrice != "") { //do not have max price condition and have min price condition
        if (filterMaxPrice == "") {
            filter.basePrice = {
                $gt: filterMinPrice
            }
        }
    }

    $.getJSON('/api/all-books', {filter}, (data) => {
        let books = [];
        data.forEach(book => {
            if (filterName != "") {
                if (!book.name.includes(filterName)){
                    return;
                }
            }
            books.push(book);
        });

        let table = $('#booksTable').DataTable();
        table.destroy();
        table.draw();

        bodyBooksTable.innerHTML = ''
        books.forEach(book => {
            let stringHTML = `
            <tr>
              <td>`+book.name+`</td>
              <td>`+book.category+`</td>
              <td>`+book.basePrice+`</td>
              <td>
                <div class="d-flex justify-content-center">
                  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editBookModal"
                    data-id=`+book._id+` data-name="`+book.name+`" ` + `data-category="`+book.category+`"
                    data-categoryid=`+book.categoryID+` data-price=`+book.basePrice+` data-description='`+book.description+`' `
            if (book.coverString) {
                if (book.coverString[0]){
                    stringHTML += `data-firstcoverstring=`+book.coversString[0]+`" data-firstcovertype="` + book.coverTypes[0]+`" `
                }
                if (book.coverString[1]){
                    stringHTML += `data-firstcoverstring=`+book.coversString[1]+`" data-firstcovertype="` + book.coverTypes[1]+`" `
                }
                if (book.coverString[2]){
                    stringHTML += `data-firstcoverstring=`+book.coversString[2]+`" data-firstcovertype="` + book.coverTypes[2]+`" `
                }
            }
            stringHTML += 
                    `>
                    Edit
                  </button>
                </div>
              </td>
            </tr>`
            bodyBooksTable.insertAdjacentHTML('beforeend', stringHTML)
        });
        
        $(document).ready(function() {
            $('#booksTable').DataTable();
          });
    });
}