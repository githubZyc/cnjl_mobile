var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		el: 'body',
		data: {
		},
	  	methods:{
	  		goBalance:function(address){
	  			mui.openWindow({
					url: "balance_record.html",
					id: "balance_record.html",
					extras: {
				    }
				});
	  		},
	  		goRedpacket:function(address){
	  			mui.openWindow({
					url: "red_packet_record.html",
					id: "red_packet_record.html",
					extras: {
				    }
				});
	  		},
	  		putBalance:function(address){
	  			mui.openWindow({
					url: "balance_put.html",
					id: "balance_put.html",
					extras: {
				    }
				});
	  		}
	  		
	  	},
	  	watch:{
	  		
	  	}
	},'div');
});
