<template>
  <div class="app-container">

    <el-form :inline="true" :model="pageInfo" class="demo-form-inline">
      <el-form-item label="车牌号">
        <el-input v-model="pageInfo.queryString" placeholder="车牌号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="this.findPage">查询</el-button>
      </el-form-item>
    </el-form>


    <el-button type="primary" @click="handleCreate()">新增角色</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="picture"
        label="车辆照片"
        width="180">
      </el-table-column>
      <el-table-column
        prop="ownerName"
        label="所属成员（业主）">
      </el-table-column>
      <el-table-column
        prop="color"
        label="车辆颜色">
      </el-table-column>

      <el-table-column
        prop="carNumber"
        label="车牌号">
      </el-table-column>

      <el-table-column
          prop="remark"
          label="备注">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>

    <el-dialog title="新增/编辑业主人员信息" :visible.sync="dialogFormVisible" @close="resetForm()">
      <el-form :model="form" ref="formRef">

        <el-form-item label="所属成员（业主）" :label-width="formLabelWidth">
          <el-select v-model="form.ownerId" placeholder="请选择业主" >
            <el-option v-for="(item,index) in ownerNameList" :key="item.id" :label="item.ownerName" :value="item.id" ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="车辆颜色" :label-width="formLabelWidth">
          <el-input v-model="form.color" autocomplete="off"></el-input>

        </el-form-item>
        <el-form-item label="车牌号" :label-width="formLabelWidth">
          <el-input v-model="form.carNumber" autocomplete="off"></el-input>

        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList ,updateCar,addCar,deleteCar,getOwnerList} from '@/api/owner/car.js'
import {getCommunityList} from "@/api/owner/info";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,

      tableData:[],
      ownerNameList:[],
      pageInfo:{
        currentPage:1,
        pageSize:5,
        queryString:'',
        total:0
      },
      form:{
        id:'',
        picture: '',
        ownerId:0,
        color:'',
        carNumber:'',
        remark:'',
      },
      dialogFormVisible:false,
      formLabelWidth: '120px'
    }
  },
  created() {
    // this.fetchData()
    this.getOwnerLists();
    this.findPage();

  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },

    getAllOwners(){
      var self = this;
      getList().then(function (res){
        self.tableData = res.data
      })
    },


    //获取所有小区的名称
    getOwnerLists(){
      var self = this;

      getOwnerList().then(function (res) {
        console.log('getOwnerLists',res.data)
        self.ownerNameList = res.data.map(item=>({
          id:item.id,
          ownerName:item.name
        }));

      })
    },


    // 每页显示条数
    handleSizeChange(pageSize){
      //更新参数值
      this.pageInfo.pageSize = pageSize;
      //返回更新后的数据
      this.findPage();

    },
    //当前页发生改变触发
    handleCurrentChange(currentPage){
      this.pageInfo.currentPage = currentPage
      this.findPage()

    },
    findPage(){
      //向后台传递数据
      var self = this;
      var param = {
        currentPage:this.pageInfo.currentPage,
        pageSize:this.pageInfo.pageSize,
        queryString:this.pageInfo.queryString,
      }
      getPageList(param).then(function (res){
        console.log('=====car',res);
        self.tableData = res.data.records;
        self.pageInfo.total = res.data.total;
      })
    },

    handleCreate(){
      this.dialogFormVisible = true;
    },
    onSubmit(){
      let self = this;
      //判断form数据模型里id有没有值
      console.log('新增/修改按钮==========',self.form.id)
      if (self.form.id==undefined){
        console.log('=========undefined=========')
        self.form.id='';
      }

      if (self.form.id!=''){
        //不为空，id有值，进行修改操作
        var param={
          id:this.form.id,
          picture: this.form.picture,
          ownerId:this.form.ownerId,
          color:this.form.color,
          carNumber:this.form.carNumber,
          remark:this.form.remark,
        }
        updateCar(param).then(function (res){
          //更新数据操作
          self.findPage();
          //关闭弹层
          self.dialogFormVisible = false;
          //重置表单数据
          self.form={};
          if(res.code==20000){
            self.$message({
              message: '恭喜你，修改车辆信息成功',
              type: 'success'
            });
          }else{
            self.$message.error('错了哦，修改车辆信息失败');

          }
        })
      }else{
        //得到form表单内容，封装为一个新的对象，传递到controller层
        var param={
          picture: this.form.picture,
          ownerId:this.form.ownerId,
          color:this.form.color,
          carNumber:this.form.carNumber,
          remark:this.form.remark,
        }
        addCar(param).then(function (res){
          //更新数据操作
          self.findPage();
          //关闭弹层
          self.dialogFormVisible = false;
          if(res.code==20000){
            self.$message({
              message: '恭喜你，添加车辆成功',
              type: 'success'
            });
          }else{
            self.$message.error('错了哦，添加车辆失败');

          }
        })
      }

    },

    handleEdit(index, row) {
      // alert(index, row);
      this.form = row
      this.dialogFormVisible = true;

    },
    handleDelete(index, row) {
      let self = this;

      //二次删除确认
      this.$confirm('此操作将永久删除该行数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // alert(index, row);
        deleteCar(row.id).then(function (res){
          //刷新数据
          self.findPage();
          if (res.code==20000){
            self.$message({
              message: '删除车辆成功',
              type: 'success'
            });
          }else{
            self.$message.error('删除车辆失败');
          }

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });





    },

    //关闭对话框后清空表单数据
    resetForm(){
      //重置form表单
      this.form={}
    }


  }
}
</script>
