<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.name"
        placeholder="名字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-input
        v-model="query.age"
        placeholder="年龄"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        创建
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
      <el-select
        v-model="selectedFields"
        multiple
        clearable
        collapse-tags
        class="filter-item"
        placeholder="请选择列"
      >
        <el-option
          v-for="item in fields"
          :key="item.value"
          :label="item.label"
          :value="item.name"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
      stripe
      style="width: 100%"
      @sort-change="sortChanged"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="row-expand">
            <el-form-item label="ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="名字">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="年龄">
              <span>{{ props.row.age }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('id')"
        prop="id"
        label="ID"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('name')"
        prop="name"
        label="名字"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="selectedFields.includes('age')"
        prop="age"
        label="年龄"
        sortable="custom"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total > 0"
      :total="total"
      :current-page.sync="query.page"
      :page-size.sync="query.size"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="getData"
      @size-change="getData"
      class="pagination-margin"
    ></el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="temp.age"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      selectedFields: ["id", "name", "age"],
      downloadLoading: false,
      fields: [
        { name: "id", label: "ID" },
        { name: "name", label: "名字" },
        { name: "age", label: "年龄" }
      ],
      rules: {
        name: [
          { required: true, message: "name is required", trigger: "change" }
        ],
        age: [{ required: true, message: "age is required", trigger: "change" }]
      },
      temp: {
        id: undefined,
        name: "",
        age: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      loading: false,
      data: [],
      total: 0,
      pageSizes: [10, 15, 20, 30, 50, 100],
      query: {
        page: 1,
        size: 10,
        sort: "",
        name: "",
        age: ""
      }
    }
  },
  methods: {
    handleDelete(id) {
      this.$confirm("将删除此记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true
        _axios.get("/api/user/delete", { id }).then(res => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 2000
          })
          this.getData()
        })
      })
    },
    jsonArrayToAoa(jsonArray) {
      if (!jsonArray || jsonArray.length === 0) {
        return []
      }
      const fieldNames = this.fields.map(field => {
        return field.name
      })
      const fieldLabels = this.fields.map(field => {
        return field.label
      })
      const aoa = jsonArray.map(json => {
        return fieldNames.map(fieldName => {
          return json[fieldName]
        })
      })
      aoa.unshift(fieldLabels)
      return aoa
    },
    handleDownload() {
      this.downloadLoading = true //https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.4/xlsx.full.min.js
      loadScript("https://unpkg.com/xlsx@0.15.4/dist/xlsx.full.min.js").then(
        () => {
          let wb = XLSX.utils.book_new()
          const aoa = this.jsonArrayToAoa(this.data)
          let ws = XLSX.utils.aoa_to_sheet(aoa)
          XLSX.utils.book_append_sheet(wb, ws, "user")
          XLSX.writeFile(wb, "user.xlsx")
          this.downloadLoading = false
        }
      )
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        age: ""
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = "create"
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate()
      })
    },
    createData() {
      console.log("createData")
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log("createData valid: ", valid)
          this.loading = true
          _axios.post("/api/user/add", this.temp).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: "创建成功",
              type: "success",
              duration: 2000
            })
            this.getData()
          })
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Created Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = "update"
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.temp)
          _axios.post("/api/user/update", tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: "更新成功",
              type: "success",
              duration: 2000
            })
            this.getData()
          })
        }
      })
    },
    handleFilter() {
      this.query.page = 1
      this.getData()
    },
    sortChanged({ column, prop, order }) {
      console.log("column, prop, order", column, prop, order)
      if (!order) {
        this.query.sort = ""
        this.handleFilter()
        return
      }
      const sign = order === "ascending" ? "+" : "-"
      this.query.sort = sign + prop
      this.handleFilter()
    },
    getData() {
      console.log("user queryAll this.query", this.query)
      this.loading = true
      _axios.get("/api/user/queryAll", this.query).then(res => {
        this.data = res.data
        this.total = res.total
        const totalPageSize = Math.ceil(this.total / this.query.size) || 1
        if (this.query.page > totalPageSize) {
          this.query.page = this.query.page - 1
          this.getData()
        } else {
          this.loading = false
        }
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>
