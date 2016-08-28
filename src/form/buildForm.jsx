
import * as _ from 'lodash';
import moment from 'moment';


import React from 'react';
import {
  Table, Button, Modal, Row, Col,
  /* 表单 */
  Form,        // 表单
  Input,       // 普通输入框: <input type="{T}" />
  InputNumber, // 数字输入框
  Checkbox,    // 多选框
  Radio,       // 单选框
  Cascader,    // 级联选择
  Transfer,    // 穿梭框
  Select,      // 选择器
  TreeSelect,  // 树选择
  Slider,      // 滑动输入条
  Switch,      // 开关
  DatePicker,  // 日期选择
  TimePicker,  // 时间选择
  Upload,      // 上传
} from 'antd';

import {
  BaseForm, FormModal, SearchForm,
  FormItem, formRules, formHelpers
} from './Form';


const Config = {
  type: "create" || "update",
  title: String, // FormModal:: title
  table: Object, // SearchForm:: Table context
  filters: Array, // SearchForm:: query filters
  layout: Array,  // SearchForm:: fields layout
  // path: String || (obj) => String, // URL path
  onSubmit: Function,
  fields: [
    {
      name: String,
      type: String,
      attrs: Object, // For <Input>
      label: String,
      placeholder: String,
      required: Boolean,
    }
  ]
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export class FormField {
  constructor({name, type, render}) {
    this.name = name;
    this.type = type;
    this.render = render;
  }
}

export function renderTextField(config) {
  const rules = config.required ? [{required: true, message: config.placeholder}] : [];
  return {
    type: "text",
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return (
        <FormItem label={config.label} {...itemProps}>
          <Input type="text" placeholder={config.placeholder}
            style={{width: '100%'}}
            {...config.attrs}
            {...inputProps}/>
        </FormItem>
      );
    }
  };
}

export function renderPasswordField(config) {
  const rules = config.required ? [{required: true, message: config.placeholder}] : [];
  return {
    type: "password",
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return (
        <FormItem label={config.label} {...itemProps}>
          <Input type="password" placeholder={config.placeholder}
            style={{width: '100%'}}
            {...config.attrs}
            {...inputProps}/>
        </FormItem>
      );
    }
  };
}

export function renderBooleanField(config) {
  const rules = config.required ? [{required: true, message: config.placeholder, type: 'boolean'}] : [];
  return {
    type: "boolean",
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return (
        <FormItem label={config.label} {...itemProps}>
          <Switch {...config.attrs} {...inputProps}/>
        </FormItem>
      );
    }
  };
}

export function renderNumberField(config) {
  const rules = config.required ? [{
    required: true, message: config.placeholder, type: 'number'
  }] : [];
  return {
    type: 'number',
    render({ field, form, itemProps }) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      const attrs = config.attrs;
      let step = attrs.step ? attrs.step : 1;
      let min = attrs.min ? attrs.min : 0;
      return (
        <FormItem label={config.label} {...itemProps}>
        <InputNumber placeholder={config.placeholder} style={{ width: '100%' }}
          {...attrs} min={min} step={step}
          {...inputProps}  />
        </FormItem>
      );
    },
  };
}

export function renderTextareaField(config) {
  const rules = config.required ? [{required: true, message: config.placeholder}] : [];
  return {
    type: "textarea",
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return (
        <FormItem label={config.label} {...itemProps}>
          <Input type="textarea" placeholder={config.placeholder}
            {...config.attrs} {...inputProps}/>
        </FormItem>
      );
    }
  };
}

export function renderFileField(config) {
  const rules = config.required ? [formRules.fileRequired(config.placeholder)] : [];
  return {
    type: "file",
    render({ field, form, itemProps }) {
      const inputProps = form.getFieldProps(field, {
        getValueProps: formHelpers.getFileValueProps,
        getValueFromEvent: formHelpers.getValueFromFileEvent,
        rules: rules,
      });

      return <FormItem label={config.label} {...itemProps}>
        <Input type="file" {...config.attrs} {...inputProps}/>
      </FormItem>;
    },
  }
}

export function renderDateField(config) {
  const rules = config.required ? [{required: true, message: config.placeholder, type: 'date'}] : [];
  return {
    type: "date",
    render({ field, form, itemProps }) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return <FormItem label={config.label} {...itemProps}>
        <DatePicker {...config.attrs} {...inputProps} />
      </FormItem>;
    }
  };
}

export function renderSelectField(config) {
  const rules = config.required ? [{required: true, message: config.placeholder}] : [];
  return {
    type: "select",
    render({form ,field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return <FormItem label={config.label} {...itemProps}>
        <Select {...config.attrs} {...inputProps}>
           {formHelpers.makeOptionElements(config.options)}
        </Select>
      </FormItem>;
    }
  };
}

export function renderMultipleSelectField(config) {
  const rules = config.required ? [
    {required: true, message: config.placeholder, type: 'array'}
  ] : [];
  return {
    type: "multiple_select",
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return <FormItem label={config.label} {...itemProps}>
        <Select multiple {...config.attrs} {...inputProps}>
           {formHelpers.makeOptionElements(config.options)}
        </Select>
      </FormItem>;
    }
  }
}

export function renderRangeDateField(config) {
  return {
    type: "range_date",
    render({form, field, itemProps}) {
      <FormItem label={config.label} {...itemProps}>
        <RangePicker {...config.attrs} {...form.getFieldProps(field)}/>
      </FormItem>
    }
  }
}

export function buildItems(config) {
  let fieldItems = {};
  config.fields.forEach(function(field) {
    if (field instanceof FormField) {
      fieldItems[field.name] = field;
    } else {
      if (field.type === undefined) {
        field.type = "text";
      }
      if (field.attrs === undefined) {
        field.attrs = {};
      }
      fieldItems[field.name] = {
        "text": renderTextField,
        "password": renderPasswordField,
        "number": renderNumberField,
        "boolean": renderBooleanField,
        "textarea": renderTextareaField,
        "file": renderFileField,
        "date": renderDateField,
        "select": renderSelectField,
        "multiple_select": renderMultipleSelectField,
      }[field.type](field);
    }
  });
  return fieldItems;
}

export function buildForm(config) {
  let fieldNames = config.fields.map((field) => field.name);
  const fieldItems = buildItems(config);

  class _Form extends BaseForm {
    static defaultProps = {
      ...BaseForm.defaultProps,
      type: config.type,
      formProps: config.formProps,
      fields: fieldNames,
      items: fieldItems
    }

    onSubmit(values, callback) {
      config.onSubmit(this, values, callback);
    }
  }

  return Form.create()(_Form);
}

export function buildFormModal(config) {
  let fieldNames = config.fields.map((field) => field.name);
  const fieldItems = buildItems(config);

  class _FormModal extends FormModal {
    static defaultProps = {
      ...FormModal.defaultProps,
      type: config.type,
      formProps: config.formProps,
      modalProps: config.modalProps,
      title: config.title,
      fields: fieldNames,
      items: fieldItems
    }

    onSubmit(values, callback) {
      config.onSubmit(this, values, callback);
    }
  }

  return Form.create()(_FormModal);
}

export function buildSearchForm(config) {
  let fieldNames = config.fields.map((field) => field.name);
  const fieldItems = buildItems(config);

  class _SearchForm extends SearchForm{
    static defaultProps = {
      ...SearchForm.defaultProps,
      type: "update",
      formProps: config.formProps,
      layout: config.layout,
      fields: fieldNames,
      items: fieldItems
    }

    onSubmit(values, callback) {
      const { fields, items } = this.props;
      const { table, filters } = config;
      let query = table.query;
      query.page = 1;
      query.filters = filters === undefined ? [] : filters;
      fields.forEach(function(name) {
        const value = values[name];
        if (value === undefined) {
          return;
        }
        const item = items[name];
        if (item.type === "range_date") {
          query.updateFilter(name, '>=', moment(value[0]).format('YYYY-MM-DD'));
          query.updateFilter(name, '<', moment(value[1]).add('days', 1).format('YYYY-MM-DD'));
        } else {
          const operation = _.get(item, 'operation', '==');
          query.updateFilter(name, operation, value);
        }
      });
      table.setState({
        query: query,
      }, () => {
        table.loadPage();
        callback(values);
      });
    }
  }

  return Form.create()(_SearchForm);
}
