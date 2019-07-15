new Vue({
    el: '#app',
    data: {
        currentTime: '0000-00-00 00:00:00',
        currentIndex: 1,
        subCurrentIndex: 0,
        onlineCurrentIndex: 0,
        currentOrder: 1,
        currentOrderDialog: 1,
        isShowDialog: true,
        dialogTitle: '结算',
        dialogIndex: 0, //0==>挂单，1==>结算，2==>扫码，3==>非水果
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
        showDialog: function (type) {
            switch (type) {
                case 0:
                    // 挂单
                    break;
                case 1:
                    // 结算
                    break;
                case 2:
                    // 扫码
                    break;
                case 3:
                    // 非水果
                    break;
            }
        },
        /**
         * 关闭dialog
         */
        closeDialog: function () {
            this.isShowDialog = false;
        }
    },
    created: function () {
        var vm = this;
        vm.getCurrentTime();
        setInterval(function () {
            vm.getCurrentTime();
        }, 1000);
    }
});