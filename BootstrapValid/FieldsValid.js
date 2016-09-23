(function($) {
    var FieldsValid = function(form, options) {
        this.$form = $(form);
        this.options = $.extend({}, $.fn.FieldsValid.DEFAULT_OPTIONS, options);

        this.$invalidFields = $([]); // 验证失败的数组
        this.$submitButton = null; // 提交按钮

        this._cacheFields = {};
        this._init();
    };

    FieldsValid.prototype = {
        constructor: FieldsValid,

        // init form
        _init: function() {
            var that = this;
            var options = {};

            this.$form
                // 在HTML5中禁用客户端验证
                .attr('novalidate', 'novalidate')
                .addClass(this.options.elementClass)

            // 禁用默认的提交事件
            .on('submit.fv', function(e) {
                    e.preventDefault();
                    that.validate();
                })
                .on('click.fv', this.options.submitButton, function() {
                    that.$submitButton = $(this);
                    that._submitIfValid = true;
                })

            // 验证所有有name属性和data-fv-field的元素，即需要被验证的元素
            .find('[name], [data-fv-field]').each(function() {
                var $field = $(this);
                var field = $field.attr('name') || $field.attr('data-fv-field');
                var opts = that._parseOptions($field);

                if (opts) {
                    $field.attr('data-fv-field', field);
                    options.fields[field] = $.extend({}, opts, options.fields[field]);
                }
            });

            this.options = $.extend(true, this.options, options);
            for (var field in this.options.fields) {
                this._initField(field);
            }

            this.$form.trigger($.Event('init.form.fv'), {
                fv: this,
                options: this.options
            });

            // Prepare the events
            if (this.options.onSuccess) {
                this.$form.on('success.form.bv', function(e) {
                    $.fn.FieldsValid.helpers.call(that.options.onSuccess, [e]);
                });
            }
            if (this.options.onError) {
                this.$form.on('error.form.bv', function(e) {
                    $.fn.FieldsValid.helpers.call(that.options.onError, [e]);
                });
            }

        },

        // 从
        _parseOptions: function($field) {
            var field = $field.attr('name') || $field.attr('data-fv-field'),
                validators = {},
                validator,
                v, // Validator name
                enabled,
                optionName,
                optionValue,
                html5AttrName,
                html5AttrMap;

            for (v in $.fn.FieldsValid.validators) {
                validator = $.fn.FieldsValid.validators[v];
                console.log(validator)
                enabled = $field.attr('data-bv-' + v.toLowerCase()) + '';
                html5AttrMap = ('function' === typeof validator.enableByHtml5) ? validator.enableByHtml5($field) : null;

                if ((html5AttrMap && enabled !== 'false') || (html5AttrMap !== true && ('' === enabled || 'true' === enabled))) {
                    // Try to parse the options via attributes
                    validator.html5Attributes = $.extend({}, { message: 'message', onerror: 'onError', onsuccess: 'onSuccess' }, validator.html5Attributes);
                    validators[v] = $.extend({}, html5AttrMap === true ? {} : html5AttrMap, validators[v]);

                    for (html5AttrName in validator.html5Attributes) {
                        optionName = validator.html5Attributes[html5AttrName];
                        optionValue = $field.attr('data-bv-' + v.toLowerCase() + '-' + html5AttrName);
                        if (optionValue) {
                            if ('true' === optionValue) {
                                optionValue = true;
                            } else if ('false' === optionValue) {
                                optionValue = false;
                            }
                            validators[v][optionName] = optionValue;
                        }
                    }
                }
            }

            var opts = {
                    excluded: $field.attr('data-bv-excluded'),
                    feedbackIcons: $field.attr('data-bv-feedbackicons'),
                    trigger: $field.attr('data-bv-trigger'),
                    message: $field.attr('data-bv-message'),
                    container: $field.attr('data-bv-container'),
                    group: $field.attr('data-bv-group'),
                    selector: $field.attr('data-bv-selector'),
                    threshold: $field.attr('data-bv-threshold'),
                    onStatus: $field.attr('data-bv-onstatus'),
                    onSuccess: $field.attr('data-bv-onsuccess'),
                    onError: $field.attr('data-bv-onerror'),
                    validators: validators
                },
                emptyOptions = $.isEmptyObject(opts), // Check if the field options are set using HTML attributes
                emptyValidators = $.isEmptyObject(validators); // Check if the field validators are set using HTML attributes

            if (!emptyValidators || (!emptyOptions && this.options.fields && this.options.fields[field])) {
                opts.validators = validators;
                return opts;
            } else {
                return null;
            }
        },

        validate: function() {
            if (!this.options.fields) {
                return this;
            }
            this.disableSubmitButtons(true);

            for (var field in this.options.fields) {
                this.validateField(field);
            }

            this._submit();

            return this;
        },

        getFieldElements: function(field) {
            if (!this._cacheFields[field]) {
                this._cacheFields[field] = (this.options.fields[field] && this.options.fields[field].selector) ? $(this.options.fields[field].selector) : this.$form.find('[name="' + field + '"]');
            }
            return this._cacheFields[field];
        },

        validateField: function() {

        }
    };

    // 扩展
    $.fn.FieldsValid = function(options) {

        return this.each(function() {

            var $this = $(this);
            $(this).data('FieldsValid', new FieldsValid(this, options));

        });
    };

    // 默认配置
    $.fn.FieldsValid.DEFAULT_OPTIONS = {
        elementClass: 'fv-form',
        submitButtons: '[type="submit"]'
    };

    // 验证规则
    $.fn.FieldsValid.validators = {};

    $.fn.FieldsValid.validators.notEmpty = {

        validate: function(validator, $field, options) {
            var type = $field.attr('type');
            if (type == 'radio' || type == 'checkbox') {
                return validators
                    .getFieldElements($field.attr('data-fv-field'))
                    .filter(':checked')
                    .length > 0;
            }
            return $.trim($field.val()) !== '';
        }
    }

})(window.jQuery)
