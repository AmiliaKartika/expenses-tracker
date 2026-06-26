/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
document.addEventListener('DOMContentLoaded', function() {
    let transactions = [];
    let totalIncome = 0;
    let totalExpense = 0;
    let isEditingID = null;
    let filteredTransactions = [];
    const RENDER_EVENT = 'render-transaction';
    const submitTransaction = document.getElementById('transactionForm');
    const searchBar = document.getElementById('searchTransactionFormTitleInput');
    const searchForm = document.getElementById('searchTransactionForm');

    // TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()
    function addTransaction() {
        const title = document.getElementById('transactionFormTitleInput').value;
        const amount = document.getElementById('transactionFormAmountInput').value;
        const date = document.getElementById('transactionFormDateInput').value;
        const type = document.getElementById('transactionFormTypeSelect').value;
        const id = generateID();

        const transactionObject = generateTransactionObject(id, title, amount, date, type);
        transactions.push(transactionObject);

        if(type === 'income') {
            totalIncome += Number(amount);
        }else {
            totalExpense += Number(amount);
        }

        updateDashboard();

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generateID() {
        return + new Date();
    }

    function generateTransactionObject(id, title, amount, date, type) {
        return {
            id,
            title,
            amount,
            date,
            type
        }
    }

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

    document.addEventListener(RENDER_EVENT, function() {
        const incomeList = document.getElementById('incomeList');
        incomeList.innerHTML = '';

        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = '';

        let showFilteredTransaction;

        if (searchBar && searchBar.value.trim() !== '') {
            showFilteredTransaction = filteredTransactions;
        } else {
            showFilteredTransaction = transactions;
        }

        for (const transactionsItem of showFilteredTransaction) {
            const transactionElement = makeTransaction(transactionsItem);
            if (transactionsItem.type === 'income') {
                incomeList.append(transactionElement);
            } else {
                expenseList.append(transactionElement);
            }
        } 
    });

    function makeTransaction(transactionObject) {
        const simbol = document.createElement('div');
        if(transactionObject.type === 'income') {
            simbol.innerHTML = '+';
            simbol.classList.add('tracker-transaction-item__icon', 'tracker-transaction-item__icon--income');
        } else {
            simbol.innerHTML = '-';
            simbol.classList.add('tracker-transaction-item__icon', 'tracker-transaction-item__icon--expense');
        }
        
        const title = document.createElement('h3');
        title.setAttribute('data-testid', 'transactionItemTitle');
        title.innerText = transactionObject.title;
        
        const date = document.createElement('p');
        date.setAttribute('data-testid', 'transactionItemDate')
        date.innerText = transactionObject.date;
        
        const type = document.createElement('p');
        type.setAttribute('data-testid', 'transactionItemType');
        type.innerText = transactionObject.type;

        const container1 = document.createElement('div');
        container1.classList.add('tracker-transaction-item__detail');
        container1.append(title, date, type);

        const amount = document.createElement('p');
        amount.setAttribute('data-testid', 'transactionItemAmount');
        if(transactionObject.type === 'income') {
            amount.classList.add('tracker-transaction-item__amount', 'tracker-transaction-item__amount--income');    
        } else {
            amount.classList.add('tracker-transaction-item__amount', 'tracker-transaction-item__amount--expense');    
        }
        amount.innerText = 'Rp ' + Number(transactionObject.amount).toLocaleString('id-ID');

        const ubahType = document.createElement('button');
        ubahType.setAttribute('data-testid', 'transactionItemUbahButton');
        ubahType.classList.add('tracker-transaction-item__btn');
        ubahType.innerText = 'Ubah';

        const editType = document.createElement('button');
        editType.setAttribute('data-testid', 'transactionItemEditTypeButton');
        editType.classList.add('tracker-transaction-item__btn');
        editType.innerText = 'Edit';

        const deleteType = document.createElement('button');
        deleteType.setAttribute('data-testid', 'transactionItemDeleteButton');
        deleteType.classList.add('tracker-transaction-item__btn');
        deleteType.innerText = 'Hapus';

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('tracker-transaction-item__actions');
        buttonContainer.append(ubahType, editType, deleteType);

        const container2 = document.createElement('div');
        container2.classList.add('tracker-transaction-item__right');
        container2.append(amount, buttonContainer);

        const containerItem = document.createElement('div');
        containerItem.setAttribute('data-testid', 'transactionItem');
        containerItem.classList.add('tracker-transaction-item');
        containerItem.append(simbol, container1, container2);

        deleteType.addEventListener('click', function() {
            removeTransaction(transactionObject.id);
            updateDashboard();
        })

        editType.addEventListener('click', function() {
            showTransactionToForm(transactionObject);
        })

        ubahType.addEventListener('click', function() {
            pindahTypeTransaction(transactionObject);
        })
        

        return containerItem;

    }

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

    submitTransaction.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('transactionFormTitleInput').value;
        const amount = document.getElementById('transactionFormAmountInput').value;
        
        if (title.trim() === '') {
            alert('Keterangan entri transaksi tidak boleh kosong/blank!');
            return;
        }

        if (Number(amount) < 1 || amount.trim() === '') {
            alert('Nilai isian nominal harus mutlak berupa hitungan (min 1 Rupiah)!');
            return;
        }

        if (isEditingID !== null) {
            console.log("Mode update aktif untuk ID:", isEditingID);
            const transactionIndex = findTransactionIndex(isEditingID);

            if(transactionIndex !== undefined && transactionIndex !== -1) {
                const oldTransactions = transactions[transactionIndex];
            
                if (oldTransactions.type === 'income') {
                    totalIncome -= Number(oldTransactions.amount);
                } else {
                    totalExpense -= Number(oldTransactions.amount);
                }
            
            }

            const newTitle = document.getElementById('transactionFormTitleInput').value;
            const newAmount = document.getElementById('transactionFormAmountInput').value;
            const newDate = document.getElementById('transactionFormDateInput').value;
            const newType = document.getElementById('transactionFormTypeSelect').value;

            transactions[transactionIndex] = {
                id: isEditingID,
                title: newTitle,
                amount: newAmount,
                date: newDate,
                type: newType
            };

            if (newType === 'income') {
                totalIncome += Number(newAmount);
            } else {
                totalExpense += Number(newAmount);
            }

            isEditingID = null;

        } else {
            addTransaction();
        }

        updateDashboard();
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        submitTransaction.reset();

        const submitButton = document.querySelector('#transactionForm button[type="submit"]');
        submitButton.innerText = 'Simpan';
    })


/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

    function updateDashboard() {
        const balance = document.getElementsByClassName('tracker-summary__balance-amount')[0];
        const income = document.getElementsByClassName('tracker-summary__stat-amount--income')[0];
        const expense = document.getElementsByClassName('tracker-summary__stat-amount--expense')[0];

        const totalbalance = totalIncome - totalExpense;

        income.innerText = "Rp " + totalIncome.toLocaleString("id-ID");
        expense.innerText = "Rp " + totalExpense.toLocaleString("id-ID");
        balance.innerText = "Rp " + totalbalance.toLocaleString("id-ID");
    }


/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

    const SAVED_EVENT = 'saved-transaction';
    const STORAGE_KEY = 'EXPENSE_TRACKER';

    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(transactions);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function isStorageExist() {
        if(typeof(Storage) === undefined) {
            alert('Browser kamu tidak mendukung local storage!');
            return false;
        }
        return true;
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if(data !== null) {
            for (const transaction of data) {
                transactions.push(transaction);
            
                if(transaction.type === 'income') {
                    totalIncome += Number(transaction.amount);
                } else {
                    totalExpense += Number(transaction.amount);
                }
            }
        }

        updateDashboard();
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if(isStorageExist()) {
        loadDataFromStorage();
    }
    

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

    function findTransactionIndex(transactionsId) {
        for (const index in transactions) {
            if (transactions[index].id === transactionsId) {
                return index;
            }
        }
    }

    function removeTransaction(transactionsId) {
        const transactionTarget = findTransactionIndex(transactionsId);

        if (transactionTarget !== -1) {
            const deleteTransaction = transactions[transactionTarget];

            if (deleteTransaction.type == 'income') {
                totalIncome -= Number(deleteTransaction.amount);
            } else {
                totalExpense -= Number(deleteTransaction.amount);
            }
        }

        transactions.splice(transactionTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function showTransactionToForm(transactionObject) {
        document.getElementById('transactionFormTitleInput').value = transactionObject.title;
        document.getElementById('transactionFormAmountInput').value = transactionObject.amount;
        document.getElementById('transactionFormDateInput').value = transactionObject.date;
        document.getElementById('transactionFormTypeSelect').value = transactionObject.type;

        const editButton = document.querySelector('#transactionForm button[type="submit"]');
        editButton.innerText = 'Update';

        isEditingID = transactionObject.id;
    }


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */
   function pindahTypeTransaction(transactionObject) {
        const transactionIndex = findTransactionIndex(transactionObject.id);

        if(transactionIndex !== undefined && transactionIndex !== -1) {
            const currentTransaction = transactions[transactionIndex];

            if (currentTransaction.type === 'income'){
                totalIncome -= Number(currentTransaction.amount);

                currentTransaction.type = 'expense';

                totalExpense += Number(currentTransaction.amount);
            } else {
                totalExpense -= Number(currentTransaction.amount);

                currentTransaction.type = 'income';

                totalIncome += Number(currentTransaction.amount);
            }

            updateDashboard();

            document.dispatchEvent(new Event(RENDER_EVENT));

            saveData();

        }
   }


/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */

   searchBar.addEventListener('input', function() {
        const keyWord = searchBar.value.toLowerCase();

        filteredTransactions = transactions.filter(function(transaction) {
            return transaction.title.toLowerCase().includes(keyWord);
        })
        document.dispatchEvent(new Event(RENDER_EVENT))
   });

   
   searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchTransaction();
   });
});