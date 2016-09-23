(function(){

	var phoneReg = /^[0-9]{11}$/;

	var Valid = function(fields, callback){
		this.fields = {};
		this.form = $(this);
		this.errMsg = '';
		this.callback = callback;

		for(var i=0; i<fields.length; i++){
			var field = fields[i];
			if(!field.validators){
				console.warn('以下配置格式不正确：');
				console.warn(field);
				continue;
			}
		}
		this.form[0].onsubmit = (function(that){
			return function(evt) {
                try {
                    return that._validateForm(evt) && (_onsubmit === undefined || _onsubmit());
                } catch (e) {}
            };
		})(this);
	};

	var attributeValue = function($ele, attrName){
		return $ele.attr(attrName);
	};

	Valid.prototype._validateField = function(field){

	}

	Valid.prototype._hooks = {
		notEmpty: function (field){

		},
		isPhone: function (field){
			return phoneReg.test(field.value);
		}
	}

	Valid.prototype._validateForm = function(evt){
        console.log('_validateForm');
		this.errors = [];
		for(var key in this.fields){
			
			var field = this.fields[key] || {};
			var element = this.form[field.name];
			if(element && element !== undefined){

			}
		}

		if (this.errors.length > 0) {
            if (evt && evt.preventDefault) {
                evt.preventDefault();
            } else if (event) {
                // IE uses the global event variable
                event.returnValue = false;
            }
        }

		evt.preventDefault();
		return true;
	}

	$.fn.Valid = Valid;
})();