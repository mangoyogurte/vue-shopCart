new Vue({
    el: '#app',
    data: {

        productList: [],
        checkAllFlag: false,
        delFlag: false,
        curProduct: ''
    },
    filters: {
        formatMoney: function(value) {
            return "¥" + value.toFixed(2);
        }

    },
    mounted: function() {
        this.$nextTick(function() {
            this.cartView();
        })
    },

    //使用watch监听整个productList的任何改变，使用起来比老师的每个函数调用calcTotalPrice简便
    watch:{

        'productList':{
            handler:function(){
                this.calcTotalPrice()
            },
            deep:true
        },

    },
    /*  使用computed虽然看起来同理，监听Checked属性，但是这里不合适，因为我还要监听productQuentity数量这个属性。
    但是使用computed的话监听不到，虽然他也写在函数里。。似乎vue没把他解释成依赖
    computed:{

        totalMoney:function () {

            var money = 0

            this.productList.forEach(function (e,i) {

                if(e.Checked) {

                    money += e.productPrice * e.productQuentity

                }

            })

            return money

        }

    }*/

    methods: {
        cartView: function() {
            var _this = this;
            this.$http.get("data/cartData.json", {"id": 123}).then(function(res) {
                _this.productList = res.body.result.list;
                // _this.totalMoney =  res.body.result.totalMoney;
            });
        },
        changeMoney: function(product, way) {
            if (way > 0) {
                product.productQuantity++;
            }
            else {
                product.productQuantity--;
                if (product.productQuantity < 1) {
                    product.productQuantity = 1;
                }
            }


        },
        calcTotalPrice: function() {
            var _this = this;
            this.totalMoney = 0;
            this.productList.forEach(function(item, index) {
                if (item.checked) {
                    _this.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        },
        selectedProduct: function(item) {
            if (typeof item.checked == 'undefined') {
                // Vue.set(item, "checked", true);


                //Vue.set原来可以这么用，用于遍历中的东西的属性
                this.$set(item, "checked", true);
            }
            else {
                item.checked = !item.checked;
            }

        },
        checkAll: function(flag) {
            this.checkAllFlag = flag;
            var _this = this;
            this.productList.forEach(function (item, index) {
                if (typeof item.checked == 'undefined', _this.checkAllFlag) {
                    _this.$set(item, "checked", _this.checkAllFlag);
                }
                else {
                    item.checked = _this.checkAllFlag;
                }
            });

        },

        delConfirm: function(item) {
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct: function() {
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index, 1);
            this.delFlag = false;
        }
    }
});
// 全局过滤器
Vue.filter('money', function(value, type) {
    return "¥" + value.toFixed(2) + type;
})
