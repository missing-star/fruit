new Vue({
    el: '#app',
    data: {
        currentTime: '0000-00-00 00:00:00',
        currentIndex: 0,
        subCurrentIndex: 0,
        onlineCurrentIndex: 0,
        offlineCurrentIndex: 0,
        currentOrder: 1,
        currentOrderOffline: 1,
        currentOrderDialog: 1,
        isShowDialog: false,
        dialogTitle: '',
        dialogIndex: 0, //0==>挂单，1==>结算，2==>扫码，3==>非水果，4==>设置
        isOpen: false
    },
    methods: {
        /**
         * 获取当前时间
         */
        getCurrentTime: function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
            var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            this.currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        },
        /**
         * 切换顶部tab
         * @param {number} index 
         */
        switchTab: function (index) {
            if (this.currentIndex != index) {
                this.currentIndex = index;
            }
        },
        /**
         *切换开关 
         */
        toggleOpen: function () {
            this.isOpen = !this.isOpen;
            localStorage.setItem('isOpen', this.isOpen.toString());
        },
        /**
         * 切换结算区右侧tab
         * @param {number} index 
         */
        switchSubTab: function (index) {
            if (this.subCurrentIndex != index) {
                this.subCurrentIndex = index;
            }
        },
        /**
         * 切换在线订单接单/未接单tab
         * @param {number} index 
         */
        switchOnlineTab: function (index) {
            if (this.onlineCurrentIndex != index) {
                this.onlineCurrentIndex = index;
            }
        },
        /**
         * 线下订单支付/未支付tab
         * @param {number} index 
         */
        switchOfflineTab: function (index) {
            if (this.offlineCurrentIndex != index) {
                this.offlineCurrentIndex = index;
            }
        },
        /**
         * 切换接单/未接单子列表
         * @param {number} onlineCurrentIndex 
         * @param {number} currentOrder 
         */
        getOrderDetail: function (onlineCurrentIndex, currentOrder) {
            if (this.onlineCurrentIndex != onlineCurrentIndex || currentOrder != this.currentOrder) {
                this.onlineCurrentIndex = onlineCurrentIndex;
                this.currentOrder = currentOrder;
            }
        },
        /**
         * 切换支付/未支付子列表
         * @param {number} onlineCurrentIndex 
         * @param {number} currentOrder 
         */
        getOrderDetailOffline: function (offlineCurrentIndex, currentOrder) {
            if (this.offlineCurrentIndex != offlineCurrentIndex || currentOrder != this.currentOrderOffline) {
                this.offlineCurrentIndex = offlineCurrentIndex;
                this.currentOrderOffline = currentOrder;
            }
        },
        /**
         * 切换挂单列表里的订单
         * @param {number} currentOrderDialog 
         */
        getOrderDetailDialog: function (currentOrderDialog) {
            if (this.currentOrderDialog != currentOrderDialog) {
                this.currentOrderDialog = currentOrderDialog;
            }
        },
        /**
         * 打印小票
         * @param {number} type
         */
        printTick: function () {

        },
        /**
         * 根据type显示不同的dialog
         * @param {number} type 
         */
        showDialog: function (type) {
            this.isShowDialog = true;
            this.dialogIndex = type;
            switch (type) {
                case 0:
                    // 挂单
                    this.dialogTitle = '挂单';
                    break;
                case 1:
                    // 结算
                    this.dialogTitle = '结算';
                    break;
                case 2:
                    // 扫码
                    this.dialogTitle = '结算';
                    break;
                case 3:
                    // 非水果
                    this.dialogTitle = '非水果类商品';
                    break;
                case 4:
                    // 设置
                    this.dialogTitle = '设置';
                    break;
            }
        },
        /**
         * 关闭dialog
         */
        closeDialog: function () {
            this.isShowDialog = false;
        },
        /**
         * 获取重量
         */
        getWeight: function () {
            setInterval(function () {
                axios.get("http://127.0.0.1:5017/api/Scale/Weight").then(function (data) {
                    if (data.data.IsSteady == 1) {
                        // 已经稳定
                        console.log(data.data.Weight.toFixed(3));
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }, 100);
        },
        /**
         * 商家登录
         */
        login: function () {
            axios.post('rpcShop/querOneShop', qs.stringify({
                shopCode: 'HP8097021061',
                shopPwd: '123'
            })).then(function (res) {

            }).catch(function (err) {

            });
        },
        /**
         * 获取商家分类列表
         */
        getCategoryList: function () {
            axios.post('rpcShop/queryshopCategoryList', {

            })
        }
    },
    created: function () {
        axios.defaults.baseURL = 'http://52.83.136.234:15555';
        var vm = this;
        vm.getCurrentTime();
        setInterval(function () {
            vm.getCurrentTime();
        }, 1000);
        // this.getWeight();
        console.log(qs);
        this.login();
    }
});