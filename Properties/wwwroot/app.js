
let jwtToken = '';
let selectedWarehouseId = '';

let globalProducts = [
    {
        id: 1,
        productName: 'Laptop Standı',
        productCode: 'PRD001',
        unitPrice: 450,
        stockQuantity: 3,
        minStockQuantity: 5,
        warehouseId: 1,
        warehouseName: 'Merkez Depo'
    },
    {
        id: 2,
        productName: 'Mekanik Klavye',
        productCode: 'PRD002',
        unitPrice: 1250,
        stockQuantity: 18,
        minStockQuantity: 10,
        warehouseId: 1,
        warehouseName: 'Merkez Depo'
    },
    {
        id: 3,
        productName: 'Oyuncu Mouse',
        productCode: 'PRD003',
        unitPrice: 650,
        stockQuantity: 45,
        minStockQuantity: 15,
        warehouseId: 2,
        warehouseName: 'Şube Depo'
    },
    {
        id: 4,
        productName: 'Type-C Hub',
        productCode: 'PRD004',
        unitPrice: 320,
        stockQuantity: 2,
        minStockQuantity: 5,
        warehouseId: 2,
        warehouseName: 'Şube Depo'
    }
];

let purchaseRequests = [];

const warehouseMap = {
    '1': 'Merkez Depo',
    '2': 'Şube Depo'
};



function getProductId(product) {
    return (
        product?.id ??
        product?.Id ??
        product?.productId ??
        product?.ProductId ??
        null
    );
}

function getProductName(product) {
    return (
        product?.productName ??
        product?.ProductName ??
        product?.name ??
        product?.Name ??
        '-'
    );
}

function getProductCode(product) {
    return (
        product?.productCode ??
        product?.ProductCode ??
        product?.code ??
        product?.Code ??
        '-'
    );
}

function getProductPrice(product) {
    return Number(
        product?.unitPrice ??
        product?.UnitPrice ??
        product?.price ??
        product?.Price ??
        0
    );
}

function getProductStock(product) {
    return Number(
        product?.stockQuantity ??
        product?.StockQuantity ??
        product?.stock ??
        product?.Stock ??
        0
    );
}

function getProductMinStock(product) {
    const value =
        product?.MinimumStock ??
        product?.minimumStock ??
        product?.minimumStockQuantity ??
        product?.MinStock ??
        product?.minStock ??
        product?.minStockQuantity ??
        product?.MinStockQuantity;

    const numericValue = Number(value);

    return numericValue > 0
        ? numericValue
        : 5;
}

function getProductWarehouseId(product) {

    const warehouseId =
        product?.depoId ??
        product?.DepoId ??
        product?.warehouseId ??
        product?.WarehouseId ??
        product?.locationId ??
        product?.LocationId ??
        product?.warehouse?.id ??
        product?.Warehouse?.Id ??
        product?.location?.id ??
        product?.Location?.Id ??
        null;

    if (
        warehouseId === null ||
        warehouseId === undefined ||
        warehouseId === ''
    ) {
        return '';
    }

    return String(warehouseId);
}

function getProductWarehouseName(product) {

    const warehouseName =
        product?.depoName ??
        product?.DepoName ??
        product?.warehouseName ??
        product?.WarehouseName ??
        product?.locationName ??
        product?.LocationName ??
        product?.warehouse?.name ??
        product?.Warehouse?.Name ??
        product?.location?.name ??
        product?.Location?.Name ??
        'Atanmamış';

    if (warehouseName === 'Atanmamış') {

        const warehouseId =
            getProductWarehouseId(product);

        if (warehouseId) {

            return (
                warehouseMap[warehouseId] ||
                'Atanmamış'
            );
        }
    }

    return warehouseName || 'Atanmamış';
}

function escapeHTML(value) {

    const div =
        document.createElement('div');

    div.textContent =
        value ?? '';

    return div.innerHTML;
}

function normalizeProduct(product) {

    return {

        ...product,

        id:
            getProductId(product),

        productName:
            getProductName(product),

        productCode:
            getProductCode(product),

        unitPrice:
            getProductPrice(product),

        stockQuantity:
            getProductStock(product),

        minStockQuantity:
            getProductMinStock(product),

        warehouseId:
            getProductWarehouseId(product),

        warehouseName:
            getProductWarehouseName(product)

    };
}


function getStockInfo(
    stock,
    minStock
) {

    stock =
        Number(stock) || 0;

    minStock =
        Number(minStock) || 1;

    const percentage =
        Math.min(
            Math.max(
                Math.round(
                    (stock / minStock) * 100
                ),
                0
            ),
            100
        );

    let status = '';
    let statusClass = '';
    let statusIcon = '';
    let barClass = '';

    if (stock <= minStock) {

        status =
            'Kritik';

        statusClass =
            'status-critical';

        statusIcon =
            'fa-circle-exclamation';

        barClass =
            'bg-danger';

    }

    else if (
        stock <= minStock * 2
    ) {

        status =
            'Düşük';

        statusClass =
            'status-low';

        statusIcon =
            'fa-triangle-exclamation';

        barClass =
            'bg-warning';

    }

    else {

        status =
            'Normal';

        statusClass =
            'status-normal';

        statusIcon =
            'fa-circle-check';

        barClass =
            'bg-success';

    }

    return {

        percentage,

        status,

        statusClass,

        statusIcon,

        barClass

    };
}

function createStockStatusHTML(
    stock,
    minStock
) {

    const stockInfo =
        getStockInfo(
            stock,
            minStock
        );

    return `

        <div class="stock-status-wrapper">

            <div class="stock-status-top">

                <span
                    class="stock-status-label ${stockInfo.statusClass}">

                    <i
                        class="fa-solid ${stockInfo.statusIcon}">
                    </i>

                    ${stockInfo.status}

                </span>

                <span
                    class="stock-percentage">

                    %${stockInfo.percentage}

                </span>

            </div>

            <div class="stock-progress">

                <div
                    class="progress-bar ${stockInfo.barClass}"
                    role="progressbar"
                    aria-valuenow="${stockInfo.percentage}"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style="width:${stockInfo.percentage}%;">
                </div>

            </div>

            <div class="stock-value">

                <span>
                    Mevcut / Minimum
                </span>

                <strong>
                    ${stock} / ${minStock}
                </strong>

            </div>

        </div>

    `;
}
function getSelectedWarehouseName() {

    if (!selectedWarehouseId) {

        return 'Tüm Depolar';

    }

    return (

        warehouseMap[
        selectedWarehouseId
        ] ||

        'Seçili Depo'

    );
}

function getFilteredProducts() {

    const searchInput =
        document.getElementById(
            'searchInput'
        );

    const query =
        searchInput

            ? searchInput.value
                .trim()
                .toLowerCase()

            : '';

    return globalProducts.filter(
        product => {

            const name =
                getProductName(
                    product
                )
                    .toLowerCase();

            const code =
                getProductCode(
                    product
                )
                    .toLowerCase();

            const matchesSearch =
                !query ||
                name.includes(query) ||
                code.includes(query);

            const warehouseId =
                getProductWarehouseId(
                    product
                );

            const matchesWarehouse =
                !selectedWarehouseId ||
                warehouseId ===
                String(
                    selectedWarehouseId
                );

            return (
                matchesSearch &&
                matchesWarehouse
            );
        }
    );
}

function refreshInventoryView() {

    const filteredProducts =
        getFilteredProducts();

    renderTable(
        filteredProducts
    );

    renderCriticalProducts(
        filteredProducts
    );

    updateTotalProductCount(
        filteredProducts
    );

    updateWarehouseDisplay();
}

function updateTotalProductCount(
    products
) {

    const totalProducts =
        document.getElementById(
            'statTotalProducts'
        );

    if (!totalProducts) {

        return;

    }

    totalProducts.innerText =
        products.length;
}

function updateWarehouseDisplay() {

    const pageSubtitle =
        document.getElementById(
            'pageSubtitle'
        );

    if (!pageSubtitle) {

        return;

    }

    const warehouseName =
        getSelectedWarehouseName();

    if (selectedWarehouseId) {

        pageSubtitle.innerText =
            `${warehouseName} için anlık stok hareketleri ve özet veriler`;

    }

    else {

        pageSubtitle.innerText =
            'Sistemdeki anlık stok hareketleri ve özet veriler';

    }
}

function handleWarehouseChange(
    warehouseId
) {

    selectedWarehouseId =
        String(
            warehouseId ?? ''
        );

    refreshInventoryView();

    loadDashboard();
}

function depoDegisti() {

    const depoSelect =
        document.getElementById(
            'depoSelect'
        );

    if (!depoSelect) {

        return;

    }

    handleWarehouseChange(
        depoSelect.value
    );
}
async function login() {

    const usernameInput =
        document.getElementById(
            'username'
        );

    const passwordInput =
        document.getElementById(
            'password'
        );

    if (
        !usernameInput ||
        !passwordInput
    ) {

        return;

    }

    const email =
        usernameInput.value.trim();

    const password =
        passwordInput.value;

    if (
        !email ||
        !password
    ) {

        alert(
            'Lütfen e-posta ve şifre girin.'
        );

        return;

    }

    try {

        const response =
            await fetch(
                '/api/Auth/login',
                {
                    method:
                        'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({
                            email:
                                email,

                            password:
                                password
                        })
                }
            );

        if (!response.ok) {

            let message =
                'E-posta veya şifre hatalı.';

            try {

                const data =
                    await response.json();

                message =
                    data?.message ??
                    data?.title ??
                    message;

            }

            catch (_) {

            }

            alert(message);

            return;
        }

        const data =
            await response.json();

        jwtToken =
            data?.token || '';

        if (!jwtToken) {

            alert(
                'Sunucudan giriş tokeni alınamadı.'
            );

            return;
        }

        const loginSection =
            document.getElementById(
                'loginSection'
            );

        const mainSection =
            document.getElementById(
                'mainSection'
            );

        if (loginSection) {

            loginSection
                .classList
                .add('d-none');

        }

        if (mainSection) {

            mainSection
                .classList
                .remove('d-none');

        }

        await loadProducts();

        await loadPurchaseRequests();

        await loadDashboard();

    }

    catch (error) {

        console.error(
            'Login hatası:',
            error
        );

        alert(
            'Sunucuya bağlanırken bir hata oluştu.'
        );
    }
}
function switchTab(
    tabName,
    evt
) {

    const tabs =
        document.querySelectorAll(
            '.tab-content'
        );

    tabs.forEach(
        tab => {

            tab.classList.add(
                'd-none'
            );

        }
    );

    const navLinks =
        document.querySelectorAll(
            '.sidebar .nav-link'
        );

    navLinks.forEach(
        link => {

            link.classList.remove(
                'active'
            );

        }
    );

    const selectedTab =
        document.getElementById(
            `tab-${tabName}`
        );

    if (selectedTab) {

        selectedTab.classList.remove(
            'd-none'
        );

    }

    if (
        evt &&
        evt.currentTarget
    ) {

        evt.currentTarget.classList.add(
            'active'
        );

    }

    if (
        tabName === 'requests'
    ) {

        loadPurchaseRequests();

    }

    const titleEl =
        document.getElementById(
            'pageTitle'
        );

    const subEl =
        document.getElementById(
            'pageSubtitle'
        );

    if (
        !titleEl ||
        !subEl
    ) {

        return;

    }

    if (
        tabName ===
        'dashboard'
    ) {

        titleEl.innerText =
            'Genel Bakış & Stok Paneli';

        updateWarehouseDisplay();

    }

    else if (
        tabName ===
        'products'
    ) {

        titleEl.innerText =
            'Ürün Envanter Yönetimi';

        subEl.innerText =
            selectedWarehouseId

                ? `${getSelectedWarehouseName()} ürünlerinin stok, fiyat ve kod detaylarının yönetimi`

                : 'Tüm ürünlerin stok, fiyat ve kod detaylarının yönetimi';

    }

    else if (
        tabName ===
        'orders'
    ) {

        titleEl.innerText =
            'Sipariş Yönetimi';

        subEl.innerText =
            'Müşteri siparişleri ve teslimat süreçleri';

    }

    else if (
        tabName ===
        'requests'
    ) {

        titleEl.innerText =
            'Satın Alma Talepleri';

        subEl.innerText =
            'Depolar arası stok tamamlama talepleri';

    }

    else if (
        tabName ===
        'reports'
    ) {

        titleEl.innerText =
            'Raporlar ve Analizler';

        subEl.innerText =
            'Finansal performans ve envanter verimliliği';

    }
}
async function loadDashboard() {

    updateTotalProductCount(
        getFilteredProducts()
    );

    updatePendingRequestCount();

    const totalOrders =
        document.getElementById(
            'statTotalOrders'
        );

    if (totalOrders) {

        totalOrders.innerText =
            '2';

    }

    try {

        let dashboardUrl =
            '/api/Dashboard/summary';

        if (
            selectedWarehouseId
        ) {

            dashboardUrl +=
                `?depoId=${encodeURIComponent(
                    selectedWarehouseId
                )}`;

        }

        const response =
            await fetch(
                dashboardUrl,
                {
                    headers: {
                        'Authorization':
                            `Bearer ${jwtToken}`
                    }
                }
            );

        if (!response.ok) {

            setFallbackRates();

            return;

        }

        const data =
            await response.json();

        const criticalStockElement =
            document.getElementById(
                'statCriticalStock'
            );

        if (
            criticalStockElement
        ) {

            criticalStockElement.innerText =
                data?.criticalStockCount ??
                data?.CriticalStockCount ??
                0;

        }

        const totalProductsElement =
            document.getElementById(
                'statTotalProducts'
            );

        if (
            totalProductsElement
        ) {

            totalProductsElement.innerText =
                data?.totalProducts ??
                data?.TotalProducts ??
                getFilteredProducts().length;

        }

        const rates =
            data?.exchangeRates ||
            data?.ExchangeRates;

        if (
            Array.isArray(rates) &&
            rates.length > 0
        ) {

            const ratesText =
                rates
                    .map(
                        rate => {

                            const currency =
                                rate?.currency ??
                                rate?.Currency ??
                                '';

                            const value =
                                Number(
                                    rate?.rate ??
                                    rate?.Rate ??
                                    0
                                );

                            return (
                                `${currency}: ${value.toFixed(2)} ₺`
                            );

                        }
                    )
                    .join(' | ');

            const exchangeElement =
                document.getElementById(
                    'statExchangeRates'
                );

            if (
                exchangeElement
            ) {

                exchangeElement.innerText =
                    ratesText;

            }

        }

        else {

            setFallbackRates();

        }

    }

    catch (error) {

        console.warn(
            'Dashboard API erişilemedi:',
            error
        );

        setFallbackRates();

    }
}

function setFallbackRates() {

    const exchangeElement =
        document.getElementById(
            'statExchangeRates'
        );

    if (
        exchangeElement
    ) {

        exchangeElement.innerText =
            'USD: 34.20 ₺ | EUR: 38.10 ₺';

    }
}
async function loadProducts() {

    try {

        const response =
            await fetch(
                '/api/Products',
                {
                    headers: {
                        'Authorization':
                            `Bearer ${jwtToken}`
                    }
                }
            );

        if (!response.ok) {

            console.warn(
                'Ürünler API tarafından alınamadı.'
            );

            refreshInventoryView();

            return;
        }

        const apiData =
            await response.json();

        if (
            Array.isArray(apiData)
        ) {

            globalProducts =
                apiData.map(
                    normalizeProduct
                );

        }

    }

    catch (error) {

        console.warn(
            'Backend API erişilemedi, mevcut veriler kullanılıyor.',
            error
        );

    }

    refreshInventoryView();
}

function renderTable(
    products
) {

    const tbody =
        document.getElementById(
            'productTableBody'
        );

    if (!tbody) {

        return;

    }

    tbody.innerHTML = '';

    if (
        !products ||
        products.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center py-5 text-secondary">

                    <i
                        class="fa-solid fa-box-open d-block mb-3"
                        style="font-size:1.5rem;">
                    </i>

                    ${selectedWarehouseId

                ? `${escapeHTML(
                    getSelectedWarehouseName()
                )} içerisinde ürün bulunamadı.`

                : 'Ürün bulunamadı.'
            }

                </td>

            </tr>

        `;

        return;
    }

    products.forEach(
        product => {

            const id =
                getProductId(
                    product
                );

            const name =
                getProductName(
                    product
                );

            const code =
                getProductCode(
                    product
                );

            const price =
                getProductPrice(
                    product
                );

            const stock =
                getProductStock(
                    product
                );

            const minStock =
                getProductMinStock(
                    product
                );

            const warehouseName =
                getProductWarehouseName(
                    product
                );

            const tr =
                document.createElement(
                    'tr'
                );

            tr.innerHTML = `

                <td
                    class="text-secondary fw-semibold">

                    #${escapeHTML(id)}

                </td>


                <td>

                    <div
                        class="fw-semibold text-white">

                        ${escapeHTML(name)}

                    </div>


                    <div
                        class="text-secondary mt-1"
                        style="font-size:0.68rem;">

                        ${escapeHTML(
                warehouseName
            )}

                    </div>

                </td>


                <td>

                    <code
                        class="text-info bg-dark px-2 py-1 rounded">

                        ${escapeHTML(code)}

                    </code>

                </td>


                <td class="text-white">

                    ${price.toLocaleString(
                'tr-TR'
            )} ₺

                </td>


                <td>

                    <span
                        class="
                            badge
                            bg-transparent
                            border
                            border-secondary
                            text-secondary
                        ">

                        ${minStock} Adet

                    </span>

                </td>


                <td
                    class="py-4 px-4 text-center font-bold text-white text-base">

                    ${stock} Adet

                </td>


                <td
                    class="stock-cell-enhanced">

                    ${createStockStatusHTML(
                stock,
                minStock
            )}

                </td>


                <td class="text-end">

                    <button
                        class="btn btn-outline-info btn-sm me-1"
                        title="Düzenle"
                        onclick="openEditModal(${Number(id)})">

                        <i
                            class="fa-solid fa-pen">
                        </i>

                    </button>


                    <button
                        class="btn btn-outline-danger btn-sm"
                        title="Sil"
                        onclick="deleteProduct(${Number(id)})">

                        <i
                            class="fa-solid fa-trash">
                        </i>

                    </button>

                </td>

            `;

            tbody.appendChild(
                tr
            );

        }
    );
}
function renderCriticalProducts(
    products
) {

    const tbody =
        document.getElementById(
            'criticalStockTableBody'
        );

    if (!tbody) {

        return;

    }

    tbody.innerHTML = '';

    const criticals =
        (products || [])
            .filter(
                product => {

                    return (

                        getProductStock(
                            product
                        ) <=

                        getProductMinStock(
                            product
                        )

                    );

                }
            );

    if (
        criticals.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center py-5">

                    <div
                        class="text-success mb-2">

                        <i
                            class="fa-solid fa-circle-check"
                            style="font-size:1.4rem;">
                        </i>

                    </div>


                    <div
                        class="fw-semibold text-white mb-1">

                        Kritik stok bulunmuyor

                    </div>


                    <div
                        class="text-secondary"
                        style="font-size:0.72rem;">

                        ${selectedWarehouseId

                ? `${escapeHTML(
                    getSelectedWarehouseName()
                )} içerisinde kritik stok bulunmuyor.`

                : 'Tüm ürünlerin stok seviyesi minimum sınırın üzerinde.'
            }

                    </div>

                </td>

            </tr>

        `;

        return;

    }

    criticals.forEach(
        product => {

            const id =
                getProductId(
                    product
                );

            const name =
                getProductName(
                    product
                );

            const code =
                getProductCode(
                    product
                );

            const stock =
                getProductStock(
                    product
                );

            const minStock =
                getProductMinStock(
                    product
                );

            const tr =
                document.createElement(
                    'tr'
                );

            tr.innerHTML = `

                <td
                    class="ps-4 text-secondary fw-semibold">

                    #${escapeHTML(id)}

                </td>


                <td>

                    <div
                        class="fw-semibold text-white">

                        ${escapeHTML(name)}

                    </div>

                </td>


                <td>

                    <code
                        class="text-info bg-dark px-2 py-1 rounded">

                        ${escapeHTML(code)}

                    </code>

                </td>


                <td>

                    <span
                        class="
                            badge
                            bg-danger
                            bg-opacity-10
                            text-danger
                            border
                            border-danger
                            border-opacity-25
                        ">

                        ${minStock} Adet

                    </span>

                </td>


                <td
                    class="
                        py-4
                        px-4
                        text-center
                        font-bold
                        text-red-400
                        text-base
                    ">

                    ${stock} Adet

                </td>


                <td
                    class="stock-cell-enhanced">

                    ${createStockStatusHTML(
                stock,
                minStock
            )}

                </td>


                <td
                    class="text-end pe-4">

                    <button
                        type="button"
                        class="btn btn-sm"
                        title="Satın alma talebi oluştur"
                        aria-label="Satın alma talebi oluştur"
                        onclick="openPurchaseRequestModal(${Number(id)})"
                        style="
                            width:30px;
                            height:30px;
                            padding:0;
                            display:inline-flex;
                            align-items:center;
                            justify-content:center;
                            border:1px solid rgba(148,163,184,.28);
                            background:rgba(148,163,184,.06);
                            color:#cbd5e1;
                            border-radius:8px;
                        ">

                        <i
                            class="fa-solid fa-file-circle-plus"
                            style="font-size:13px;">
                        </i>

                    </button>

                </td>

            `;

            tbody.appendChild(
                tr
            );

        }
    );
}

function getPurchaseRequestProduct(
    productId
) {

    return globalProducts.find(
        product =>

            Number(
                getProductId(
                    product
                )
            ) ===

            Number(productId)
    );
}

function openPurchaseRequestModal(
    productId
) {

    const product =
        getPurchaseRequestProduct(
            productId
        );

    if (!product) {

        alert(
            'Ürün bilgisi bulunamadı.'
        );

        return;

    }

    if (!jwtToken) {

        alert(
            'Önce sisteme giriş yapmalısınız.'
        );

        return;

    }

    const existingPendingRequest =
        purchaseRequests.find(
            request => {

                const requestProductId =
                    Number(

                        request?.productId ??
                        request?.ProductId ??
                        0

                    );

                const status =
                    String(

                        request?.status ??
                        request?.Status ??
                        ''

                    ).toLowerCase();

                return (

                    requestProductId ===
                    Number(productId) &&

                    status ===
                    'pending'

                );

            }
        );

    if (
        existingPendingRequest
    ) {

        alert(

            `${getProductName(product)} için zaten bekleyen bir satın alma talebi bulunmaktadır.`

        );

        return;

    }

    const currentStock =
        getProductStock(
            product
        );

    const minStock =
        getProductMinStock(
            product
        );

    const defaultQuantity =

        Math.max(

            minStock -
            currentStock,

            1

        );


    const oldModal =
        document.getElementById(
            'purchaseRequestModal'
        );

    if (oldModal) {

        oldModal.remove();

    }


    const modalHtml = `

        <div
            class="modal fade"
            id="purchaseRequestModal"
            tabindex="-1"
            aria-hidden="true">

            <div
                class="modal-dialog modal-dialog-centered modal-sm">

                <div
                    class="modal-content"
                    style="
                        background:#101725;
                        border:1px solid #202b3e;
                        border-radius:14px;
                    ">


                    <div
                        class="
                            modal-header
                            border-secondary
                            border-opacity-10
                            py-3
                        ">

                        <div>

                            <div
                                class="fw-bold text-white">

                                Satın Alma Talebi

                            </div>

                            <div
                                class="text-secondary"
                                style="font-size:.72rem;">

                                ${escapeHTML(
        getProductName(
            product
        )
    )}

                            </div>

                        </div>


                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Kapat">
                        </button>

                    </div>


                    <div class="modal-body">


                        <div
                            class="
                                d-flex
                                justify-content-between
                                mb-3
                            ">

                            <span
                                class="text-secondary small">

                                Mevcut stok

                            </span>

                            <strong
                                class="text-white">

                                ${currentStock} adet

                            </strong>

                        </div>


                        <div
                            class="
                                d-flex
                                justify-content-between
                                mb-3
                            ">

                            <span
                                class="text-secondary small">

                                Minimum stok

                            </span>

                            <strong
                                class="text-white">

                                ${minStock} adet

                            </strong>

                        </div>


                        <label
                            for="purchaseRequestQuantity"
                            class="form-label small text-secondary fw-semibold">

                            Talep miktarı

                        </label>


                        <input
                            id="purchaseRequestQuantity"
                            type="number"
                            min="1"
                            step="1"
                            value="${defaultQuantity}"
                            class="form-control">

                    </div>


                    <div
                        class="
                            modal-footer
                            border-secondary
                            border-opacity-10
                            py-2
                        ">

                        <button
                            type="button"
                            class="btn btn-outline-secondary btn-sm"
                            data-bs-dismiss="modal">

                            Vazgeç

                        </button>


                        <button
                            type="button"
                            class="btn btn-primary btn-sm"
                            onclick="submitPurchaseRequest(${Number(productId)})">

                            Talebi Oluştur

                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        'beforeend',
        modalHtml
    );


    const modalElement =
        document.getElementById(
            'purchaseRequestModal'
        );


    const modalInstance =
        new bootstrap.Modal(
            modalElement
        );


    modalElement.addEventListener(
        'hidden.bs.modal',
        function () {

            modalElement.remove();

        }
    );


    modalInstance.show();

}



async function submitPurchaseRequest(
    productId
) {

    const product =
        getPurchaseRequestProduct(
            productId
        );

    const quantityInput =
        document.getElementById(
            'purchaseRequestQuantity'
        );

    if (
        !product ||
        !quantityInput
    ) {

        return;

    }


    const quantity =
        parseInt(
            quantityInput.value,
            10
        );


    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        alert(
            'Geçerli bir talep miktarı girin.'
        );

        quantityInput.focus();

        return;

    }


    const currentStock =
        getProductStock(
            product
        );


    const minStock =
        getProductMinStock(
            product
        );


    const confirmed =
        confirm(

            `${getProductName(product)} için ${quantity} adet satın alma talebi oluşturulsun mu?`

        );


    if (!confirmed) {

        return;

    }


    const modalElement =
        document.getElementById(
            'purchaseRequestModal'
        );


    const submitButton =
        modalElement
            ?.querySelector(
                '.btn-primary'
            );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.innerText =
            'Kaydediliyor...';

    }


    try {

        const response =
            await fetch(
                '/api/PurchaseRequests',
                {
                    method:
                        'POST',

                    headers: {

                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${jwtToken}`

                    },

                    body:

                        JSON.stringify({

                            productId:
                                Number(productId),

                            itemName:
                                getProductName(
                                    product
                                ),

                            quantity:
                                quantity,

                            description:

                                `Kritik stok nedeniyle manuel satın alma talebi oluşturuldu. Mevcut stok: ${currentStock}, minimum stok: ${minStock}.`

                        })

                }
            );


        if (!response.ok) {

            let message =
                'Satın alma talebi oluşturulamadı.';


            try {

                const data =
                    await response.json();


                message =

                    data?.message ??

                    data?.title ??

                    message;

            }

            catch (_) {

            }


            throw new Error(
                message
            );

        }


        const createdRequest =
            await response.json();


        if (modalElement) {

            const modalInstance =
                bootstrap.Modal.getInstance(
                    modalElement
                );


            if (modalInstance) {

                modalInstance.hide();

            }

        }


        await loadPurchaseRequests();

        await loadDashboard();


        alert(

            `Satın alma talebi oluşturuldu.\n\n` +

            `Talep No: ${createdRequest?.requestNo ??

            createdRequest?.RequestNo ??

            '-'

            }`

        );


        switchTab(
            'requests'
        );

    }

    catch (error) {

        console.error(

            'Satın alma talebi oluşturma hatası:',

            error

        );


        alert(

            error?.message ??

            'Satın alma talebi oluşturulurken bir hata oluştu.'

        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerText =
                'Talebi Oluştur';

        }

    }

}

async function createPurchaseRequest(
    productId
) {

    openPurchaseRequestModal(
        productId
    );

}
function openAddModal() {

    const title =
        document.getElementById(
            'productModalTitle'
        );

    const id =
        document.getElementById(
            'modalProductId'
        );

    const name =
        document.getElementById(
            'modalProductName'
        );

    const code =
        document.getElementById(
            'modalProductCode'
        );

    const price =
        document.getElementById(
            'modalUnitPrice'
        );

    const stock =
        document.getElementById(
            'modalStockQuantity'
        );

    const minStock =
        document.getElementById(
            'modalMinStock'
        );


    if (title) {

        title.innerText =
            'Yeni Ürün Ekle';

    }


    if (id) {

        id.value = '';

    }


    if (name) {

        name.value = '';

    }


    if (code) {

        code.value = '';

    }


    if (price) {

        price.value = '';

    }


    if (stock) {

        stock.value = '';

    }


    if (minStock) {

        minStock.value = '5';

    }


    const modalElement =
        document.getElementById(
            'productModal'
        );


    if (!modalElement) {

        return;

    }


    let modalInstance =
        bootstrap.Modal.getInstance(
            modalElement
        );


    if (!modalInstance) {

        modalInstance =
            new bootstrap.Modal(
                modalElement
            );

    }


    modalInstance.show();

}



function openEditModal(
    id
) {

    const product =
        globalProducts.find(
            item =>

                Number(
                    getProductId(
                        item
                    )
                ) ===
                Number(id)
        );


    if (!product) {

        return;

    }


    const title =
        document.getElementById(
            'productModalTitle'
        );


    const modalId =
        document.getElementById(
            'modalProductId'
        );


    const modalName =
        document.getElementById(
            'modalProductName'
        );


    const modalCode =
        document.getElementById(
            'modalProductCode'
        );


    const modalPrice =
        document.getElementById(
            'modalUnitPrice'
        );


    const modalStock =
        document.getElementById(
            'modalStockQuantity'
        );


    const modalMinStock =
        document.getElementById(
            'modalMinStock'
        );


    if (title) {

        title.innerText =
            'Ürün Düzenle';

    }


    if (modalId) {

        modalId.value =
            id;

    }


    if (modalName) {

        modalName.value =
            getProductName(
                product
            );

    }


    if (modalCode) {

        modalCode.value =
            getProductCode(
                product
            );

    }


    if (modalPrice) {

        modalPrice.value =
            getProductPrice(
                product
            );

    }


    if (modalStock) {

        modalStock.value =
            getProductStock(
                product
            );

    }


    if (modalMinStock) {

        modalMinStock.value =
            getProductMinStock(
                product
            );

    }


    const modalElement =
        document.getElementById(
            'productModal'
        );


    if (!modalElement) {

        return;

    }


    let modalInstance =
        bootstrap.Modal.getInstance(
            modalElement
        );


    if (!modalInstance) {

        modalInstance =
            new bootstrap.Modal(
                modalElement
            );

    }


    modalInstance.show();

}



async function saveProduct() {

    const id =
        document.getElementById(
            'modalProductId'
        )?.value ?? '';


    const name =
        document.getElementById(
            'modalProductName'
        )?.value
            ?.trim() ?? '';


    const code =
        document.getElementById(
            'modalProductCode'
        )?.value
            ?.trim() ?? '';


    const price =
        parseFloat(
            document.getElementById(
                'modalUnitPrice'
            )?.value
        ) || 0;


    const stock =
        parseInt(
            document.getElementById(
                'modalStockQuantity'
            )?.value,
            10
        ) || 0;


    const minStock =
        parseInt(
            document.getElementById(
                'modalMinStock'
            )?.value,
            10
        ) || 5;


    if (
        !name ||
        !code
    ) {

        alert(
            'Lütfen Ürün Adı ve Kodunu doldurun!'
        );

        return;

    }


    if (
        stock < 0
    ) {

        alert(
            'Mevcut stok 0 veya daha büyük olmalıdır.'
        );

        return;

    }


    if (
        minStock < 0
    ) {

        alert(
            'Minimum stok 0 veya daha büyük olmalıdır.'
        );

        return;

    }


    const currentWarehouseId =
        selectedWarehouseId || '';


    const payload = {

        productName:
            name,

        productCode:
            code,

        unitPrice:
            price,

        stockQuantity:
            stock,

        minimumStock:
            minStock,

        depoId:
            currentWarehouseId

                ? Number(
                    currentWarehouseId
                )

                : null

    };


    const isEdit =
        id !== '';


    const url =
        isEdit

            ? `/api/Products/${id}`

            : '/api/Products';


    const method =
        isEdit

            ? 'PUT'

            : 'POST';


    if (isEdit) {

        payload.id =
            parseInt(
                id,
                10
            );

    }


    try {

        const response =
            await fetch(
                url,
                {

                    method:
                        method,

                    headers: {

                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${jwtToken}`

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        if (!response.ok) {

            let message =
                'Sunucu ürün kaydını kabul etmedi.';


            try {

                const data =
                    await response.json();


                message =
                    data?.message ??
                    data?.title ??
                    message;

            }

            catch (_) {

            }


            alert(message);

            return;

        }


        await loadProducts();


        const modalElement =
            document.getElementById(
                'productModal'
            );


        const modalInstance =
            modalElement

                ? bootstrap.Modal.getInstance(
                    modalElement
                )

                : null;


        if (modalInstance) {

            modalInstance.hide();

        }

    }

    catch (error) {

        console.error(
            'Ürün kayıt hatası:',
            error
        );


        alert(
            'Ürün kaydedilirken bir hata oluştu.'
        );

    }

}



async function deleteProduct(
    id
) {

    if (

        !confirm(

            `#${id} ID'li ürünü silmek istediğinize emin misiniz?`

        )

    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/Products/${id}`,
                {

                    method:
                        'DELETE',

                    headers: {

                        'Authorization':
                            `Bearer ${jwtToken}`

                    }

                }
            );


        if (!response.ok) {

            let message =
                'Sunucu ürünü silemedi.';


            try {

                const data =
                    await response.json();


                message =
                    data?.message ??
                    data?.title ??
                    message;

            }

            catch (_) {

            }


            alert(message);

            return;

        }


        await loadProducts();

    }

    catch (error) {

        console.error(
            'API silme başarısız:',
            error
        );


        alert(
            'Ürün silinirken bir hata oluştu.'
        );

    }

}




async function loadPurchaseRequests() {

    if (!jwtToken) {

        purchaseRequests =
            [];

        updatePendingRequestCount();

        return;

    }


    try {

        const response =
            await fetch(
                '/api/PurchaseRequests',
                {

                    method:
                        'GET',

                    headers: {

                        'Authorization':
                            `Bearer ${jwtToken}`

                    }

                }
            );


        if (!response.ok) {

            console.warn(
                'Satın alma talepleri alınamadı.'
            );

            return;

        }


        const data =
            await response.json();


        purchaseRequests =

            Array.isArray(data)

                ? data

                : [];


        renderPurchaseRequests();


        updatePendingRequestCount();

    }

    catch (error) {

        console.error(

            'Satın alma talepleri API hatası:',

            error

        );

    }

}




function updatePendingRequestCount() {

    const pendingRequestsElement =
        document.getElementById(
            'statPendingRequests'
        );


    if (!pendingRequestsElement) {

        return;

    }


    const pendingCount =

        purchaseRequests.filter(

            request => {

                const status =
                    String(

                        request?.status ??
                        request?.Status ??
                        ''

                    ).toLowerCase();


                return (
                    status ===
                    'pending'
                );

            }

        ).length;


    pendingRequestsElement.innerText =
        pendingCount;

}




function getPurchaseRequestTableBody() {

    const directBody =
        document.getElementById(
            'requestTableBody'
        );


    if (directBody) {

        return directBody;

    }


    const requestsTab =
        document.getElementById(
            'tab-requests'
        );


    if (!requestsTab) {

        return null;

    }


    return requestsTab.querySelector(
        'table tbody'
    );

}




function getPurchaseRequestStatusInfo(
    status
) {

    const normalizedStatus =

        String(
            status ?? ''
        )
            .trim()
            .toLowerCase();


    if (
        normalizedStatus ===
        'approved'
    ) {

        return {

            text:
                'Onaylandı',

            className:
                'badge bg-success'

        };

    }


    if (
        normalizedStatus ===
        'rejected'
    ) {

        return {

            text:
                'Reddedildi',

            className:
                'badge bg-danger'

        };

    }


    return {

        text:
            'Onay Bekliyor',

        className:
            'badge bg-warning text-dark'

    };

}




function renderPurchaseRequests() {

    const tbody =
        getPurchaseRequestTableBody();


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        '';


    if (

        !purchaseRequests ||

        purchaseRequests.length === 0

    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center py-5 text-secondary">

                    <i
                        class="fa-solid fa-inbox d-block mb-3"
                        style="font-size:1.5rem;">
                    </i>


                    <div
                        class="fw-semibold text-white mb-1">

                        Henüz satın alma talebi bulunmuyor.

                    </div>


                    <div
                        style="font-size:0.75rem;">

                        Kritik stok seviyesindeki ürünlerden
                        satın alma talebi oluşturabilirsiniz.

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    const sortedRequests =
        [...purchaseRequests].sort(

            (a, b) => {

                const dateA =
                    new Date(

                        a?.createdDate ??
                        a?.CreatedDate ??
                        0

                    ).getTime();


                const dateB =
                    new Date(

                        b?.createdDate ??
                        b?.CreatedDate ??
                        0

                    ).getTime();


                return dateB - dateA;

            }

        );


    sortedRequests.forEach(
        request => {

            const id =

                request?.id ??
                request?.Id ??
                0;


            const requestNo =

                request?.requestNo ??
                request?.RequestNo ??
                `REQ-${id}`;


            const productId =

                Number(

                    request?.productId ??
                    request?.ProductId ??
                    0

                );


            let itemName =

                request?.itemName ??
                request?.ItemName ??
                '';


            if (!itemName) {

                const product =
                    getPurchaseRequestProduct(
                        productId
                    );


                if (product) {

                    itemName =

                        `${getProductName(product)} (${getProductCode(product)})`;

                }

            }


            if (!itemName) {

                itemName =
                    'Ürün bulunamadı';

            }


            const quantity =

                Number(

                    request?.quantity ??
                    request?.Quantity ??
                    0

                );


            const status =

                request?.status ??
                request?.Status ??
                'Pending';


            const statusInfo =

                getPurchaseRequestStatusInfo(
                    status
                );


            const product =

                getPurchaseRequestProduct(
                    productId
                );


            const warehouseName =

                product

                    ? getProductWarehouseName(
                        product
                    )

                    : 'Atanmamış';


            const createdDateRaw =

                request?.createdDate ??
                request?.CreatedDate;


            let createdDateText =
                '-';


            if (
                createdDateRaw
            ) {

                const date =
                    new Date(
                        createdDateRaw
                    );


                if (
                    !isNaN(
                        date.getTime()
                    )
                ) {

                    createdDateText =

                        date.toLocaleDateString(
                            'tr-TR'
                        );

                }

            }


            const isPending =

                String(
                    status
                ).toLowerCase() ===
                'pending';


            const tr =
                document.createElement(
                    'tr'
                );


            tr.innerHTML = `

                <td
                    class="ps-4 font-monospace text-primary">

                    #${escapeHTML(
                requestNo
            )}


                    <div
                        class="text-secondary mt-1"
                        style="font-size:0.68rem;">

                        ${escapeHTML(
                createdDateText
            )}

                    </div>

                </td>


                <td>

                    ${escapeHTML(
                warehouseName
            )}

                </td>


                <td
                    class="fw-semibold">

                    ${escapeHTML(
                itemName
            )}

                </td>


                <td>

                    ${quantity} Adet

                </td>


                <td>

                    <span
                        id="req-status-${Number(id)}"
                        class="${statusInfo.className}">

                        ${statusInfo.text}

                    </span>

                </td>


                <td
                    class="text-end pe-4">

                    ${isPending

                    ? `

                                <button
                                    class="btn btn-sm btn-success me-1 px-3"
                                    onclick="approveRequest(${Number(id)})">

                                    <i
                                        class="fa-solid fa-check me-1">
                                    </i>

                                    Onayla

                                </button>


                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    onclick="rejectRequest(${Number(id)})">

                                    <i
                                        class="fa-solid fa-xmark">
                                    </i>

                                </button>

                              `

                    : `

                                <span
                                    class="text-secondary"
                                    style="font-size:0.75rem;">

                                    İşlem tamamlandı

                                </span>

                              `
                }

                </td>

            `;


            tbody.appendChild(
                tr
            );

        }

    );

}



async function approveRequest(
    reqId
) {

    const confirmed =

        confirm(

            'Bu satın alma talebini onaylamak istediğinize emin misiniz?'

        );


    if (!confirmed) {

        return;

    }


    try {

        const response =

            await fetch(

                `/api/PurchaseRequests/${Number(reqId)}/approve`,

                {

                    method:
                        'POST',

                    headers: {

                        'Authorization':
                            `Bearer ${jwtToken}`

                    }

                }

            );


        if (!response.ok) {

            let message =
                'Talep onaylanamadı.';


            try {

                const data =
                    await response.json();


                message =

                    data?.message ??
                    data?.title ??
                    message;

            }

            catch (_) {

            }


            throw new Error(
                message
            );

        }


        await loadPurchaseRequests();

        await loadDashboard();

    }

    catch (error) {

        console.error(

            'Talep onaylama hatası:',

            error

        );


        alert(

            error?.message ??

            'Talep onaylanırken bir hata oluştu.'

        );

    }

}



async function rejectRequest(
    reqId
) {

    const confirmed =

        confirm(

            'Bu satın alma talebini reddetmek istediğinize emin misiniz?'

        );


    if (!confirmed) {

        return;

    }


    try {

        const response =

            await fetch(

                `/api/PurchaseRequests/${Number(reqId)}/reject`,

                {

                    method:
                        'POST',

                    headers: {

                        'Authorization':
                            `Bearer ${jwtToken}`

                    }

                }

            );


        if (!response.ok) {

            let message =
                'Talep reddedilemedi.';


            try {

                const data =
                    await response.json();


                message =

                    data?.message ??
                    data?.title ??
                    message;

            }

            catch (_) {

            }


            throw new Error(
                message
            );

        }


        await loadPurchaseRequests();

        await loadDashboard();

    }

    catch (error) {

        console.error(

            'Talep reddetme hatası:',

            error

        );


        alert(

            error?.message ??

            'Talep reddedilirken bir hata oluştu.'

        );

    }

}



function filterProducts() {

    refreshInventoryView();

}



document.addEventListener(

    'depoChanged',

    function (event) {

        const depoId =

            event?.detail?.depoId ??
            '';


        handleWarehouseChange(
            depoId
        );

    }

);



window.addEventListener(

    'DOMContentLoaded',

    function () {

        const depoSelect =

            document.getElementById(
                'depoSelect'
            );


        if (depoSelect) {

            selectedWarehouseId =

                depoSelect.value ||
                '';

        }


       
        refreshInventoryView();

    }

);



function logout() {

    jwtToken =
        '';

    selectedWarehouseId =
        '';

    purchaseRequests =
        [];


    const depoSelect =
        document.getElementById(
            'depoSelect'
        );


    if (depoSelect) {

        depoSelect.value =
            '';

    }


    const loginSection =
        document.getElementById(
            'loginSection'
        );


    const mainSection =
        document.getElementById(
            'mainSection'
        );


    if (loginSection) {

        loginSection
            .classList
            .remove('d-none');

    }


    if (mainSection) {

        mainSection
            .classList
            .add('d-none');

    }


    const purchaseModal =
        document.getElementById(
            'purchaseRequestModal'
        );


    if (purchaseModal) {

        const modalInstance =

            bootstrap.Modal.getInstance(
                purchaseModal
            );


        if (modalInstance) {

            modalInstance.hide();

        }

    }


    updatePendingRequestCount();

}
function getPurchaseRequestCount() {

    return purchaseRequests.length;

}
function getPendingPurchaseRequestCount() {

    return purchaseRequests.filter(

        request => {

            const status =

                String(

                    request?.status ??
                    request?.Status ??
                    ''

                ).toLowerCase();


            return (
                status ===
                'pending'
            );

        }

    ).length;

}