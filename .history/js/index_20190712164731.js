new Vue({
    el: '#app',
    data: {
        currentTime: '0000-00-00 00:00:00',
        currentIndex:1,
        subCurrentIndex:0,
        onlineCurrentIndex:0,
        currentOrder:1
    },
    methods: {
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
        switchTab:function(index) {
            if(this.currentIndex != index) {
                this.currentIndex = index;
            }
        },
        switchSubTab:function(index) {
            if(this.subCurrentIndex != index) {
                this.subCurrentIndex = index;
            }
        },
        switchOnlineTab:function(index) {
            if(this.onlineCurrentIndex != index) {
                this.onlineCurrentIndex = index;
            }
        },
        getOrderDetail:function(onlineCurrentIndex,currentOrder) {
            if(this.onlineCurrentIndex != onlineCurrentIndex || currentOrder != this.currentOrder) {
                this.onlineCurrentIndex = onlineCurrentIndex;
                this.currentOrder = currentOrder;
            }
        }
    },
    created: function () {
        var vm = this;
        vm.getCurrentTime();
        setInterval(function(){
            vm.getCurrentTime();
        }, 1000);
    }
});