<template>
  <div class="map_con">
    <div
      v-if="open"
      class="image_preview"
      v-show="isPreview"
      @click.right="rightEvent"
      ref="image"
      @contextmenu.prevent
    >
      <el-button
        @click="handleCloseMapImage"
        size="mini"
        type="danger"
        class="back"
      >
        <i class="el-icon-back" />
        返回
      </el-button>
      <el-image
        style="width: 1300px; height: 800px"
        class="image"
        :src="mapUrl"
      >
        <div class="image-slot" slot="placeholder">
          <div>加载中...</div>
        </div>
        <div slot="error" class="image-slot">
          <div>暂无图片</div>
        </div>
      </el-image>
    </div>

    <div class="con" v-show="drawer">
      <el-button type="primary" round plain @click="editClose"
        >结束编辑</el-button
      >
    </div>
    <div class="map" id="container" v-show="!isPreview"></div>

    <!-- dialog弹窗 -->
    <el-dialog
      title="站点信息"
      :visible.sync="visible"
      width="50%"
      center
      append-to-body
      :before-close="handleCancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机构名称" prop="orgId" label-width="100px">
          <treeselect
            v-model="form.orgId"
            :options="deptOptions"
            :show-count="true"
            :flat="true"
            :normalizer="normalizer"
            placeholder="选择机构名称"
          />
        </el-form-item>
        <el-form-item label="机构地址" prop="address" label-width="100px">
          <el-input
            ref="pickerInput"
            id="pickerInput"
            v-model="form.address"
            placeholder="省份＋城市＋区县＋城镇＋乡村＋街道＋门牌号"
            @change="handleChange"
          ></el-input>
          <div id="input-info"></div>
        </el-form-item>
        <el-form-item label="地图名称" prop="name" label-width="100px">
          <el-input v-model="form.name" placeholder="请输入地图名称"></el-input>
        </el-form-item>
        <el-form-item label="添加平面图" prop="mapUrl" label-width="100px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleSuccess"
          >
            <img v-if="form.mapUrl" :src="form.mapUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk">保 存</el-button>
        <el-button type="danger" @click="handleCancel">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- dialog弹窗 -->
    <el-dialog
      title="添加监控"
      :visible.sync="visible2"
      width="50%"
      center
      append-to-body
      :before-close="handleCancel2"
    >
      <el-form ref="formCamera" :model="formCamera" :rules="formCameraRules">
        <el-form-item label="机构名称" prop="orgId" label-width="100px">
          <treeselect
            v-model="formCamera.orgId"
            :options="deptOptions"
            :show-count="true"
            :flat="true"
            :normalizer="normalizer"
            placeholder="选择机构"
          />
        </el-form-item>

        <el-form-item label="摄像机名称" prop="id" label-width="100px">
          <el-select
            style="width: 100%"
            v-model="formCamera.id"
            placeholder="选择摄像机"
          >
            <el-option
              v-for="item in cameraOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk2">保 存</el-button>
        <el-button type="danger" @click="handleCancel2">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 选择摄像头的dialog -->
    <el-dialog
      title="选择摄像头"
      :visible.sync="cameraVisible"
      width="500px"
      :before-close="handleCloseCamera"
    >
      <el-form ref="formCamera" :model="formCamera" :rules="formCameraRules">
        <el-form-item label="机构名称" prop="orgId" label-width="100px">
          <el-cascader
            ref="cascaderAder"
            style="width: 100%"
            collapse-tags
            placeholder="请选择机构"
            :options="deptOptions"
            :disabled="true"
            :props="{
              value: 'id',
              label: 'label',
              checkStrictly: true,
              emitPath: false,
            }"
            :show-all-levels="false"
            v-model="formCamera.orgId"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="摄像机名称" prop="id" label-width="100px">
          <el-select
            style="width: 100%"
            v-model="formCamera.id"
            placeholder="选择摄像机"
          >
            <el-option
              v-for="item in cameraOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCloseCamera" type="danger">关 闭</el-button>
        <el-button type="primary" @click="handleOkCamera">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { getToken } from "@/utils/auth";

import {
  getStationIcon,
  addStation,
  getPetrolStation,
  saveStationInfo,
  unMarkerStation,
  getCenterLevel,
  addCenterLevel,
  getCameraList,
  saveCamera,
  deleteCamera,
  getCameraMarker,
  deletePlanCamera,
  getPolygonList,
  savePolygon,
  delPolygon,
  getCarPlace,
} from "@/api/operation/mapManage.js";

import { mapGetters } from "vuex";
const lineArr = [
  [116.478935, 39.997761],
  [116.478939, 39.997825],
  [116.478912, 39.998549],
  [116.478912, 39.998549],
  [116.478998, 39.998555],
  [116.478998, 39.998555],
  [116.479282, 39.99856],
  [116.479658, 39.998528],
  [116.480151, 39.998453],
  [116.480784, 39.998302],
  [116.480784, 39.998302],
  [116.481149, 39.998184],
  [116.481573, 39.997997],
  [116.481863, 39.997846],
  [116.482072, 39.997718],
  [116.482362, 39.997718],
  [116.483633, 39.998935],
  [116.48367, 39.998968],
  [116.484648, 39.999861]
];
export default {
  components: { Treeselect },
  props: {},
  data() {
    return {
      carMarker: null,
      lineArr: lineArr,
      /* 地图右键菜单 */
      contextMenu: null,
      /* 区域数组数据 */
      polygonList: [],
      cameraVisible: null,
      open: true,
      mapUrl: null,
      cameraMarker: null, // 摄像头实例
      cameraMarkerList: [],
      isPreview: false,
      previewList: [], // 预览图片
      /* 节点双击是否请求 */
      isRequest: false,
      org_Id2: null, // 点击节点保存的id
      /* 上传图片参数 */
      uploadUrl: process.env.VUE_APP_BASE_API + "/file/upload/image",
      headers: { Authorization: "Bearer " + getToken() },

      imageUrl: null, // 上传成功后图片的Url

      visible_menu: false,

      polygonMenu: null /* 区域的右键菜单 */,
      editStatus: false, // 编辑状态

      poiPicker: null, // poi搜索实例
      path: [], // 多边形的数组
      polyEditor: null,
      polygon: null,
      mouseTool: null,
      drawer: false,

      marker: false,
      zoom: null,
      zoom_: null,
      center: [],
      size: [],

      message: "请打开或关闭信息窗体试试！",
      infoWindow: null,

      visible_pop: true,
      /* 鼠标在图片上的坐标 */
      offsetX: null,
      offsetY: null,
      /* 点前点击的加油站 数据 */
      current_stand_data: {},
      visible_a: false,

      list: [], // 加油站站点图标
      /* 当前的位置 */
      current_XY: [],
      fileList: [], // 文件数组
      // 部门树选项
      deptOptions: [],
      mapStyle: "amap://styles/5289fde4cf78937626b1d9119a07bede",

      visible: false, // 添加站点信息
      visible2: false, // 添加监控
      // 添加加油站站点
      // 添加加油站信息
      form: {
        id: null, // id
        orgId: null, // 机构部门
        address: null, // 机构地址
        name: null, // 地图名称
        mapUrl: null, // 上传的图片url

        longitude: null,
        latitude: null,
      },
      rules: {
        orgId: [
          { required: true, message: "机构名称不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "机构地址不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "地图名称不能为空", trigger: "blur" },
        ],
        mapUrl: [
          { required: true, message: "平面图不能为空", trigger: "blur" },
        ],
      },

      // 添加监控
      formCamera: {
        id: null,
        orgId: null,
        longitude: null,
        latitude: null,
      },
      formCameraRules: {
        orgId: [
          { required: true, message: "机构名称不能为空", trigger: "blur" },
        ],
        id: [
          { required: true, message: "摄像机名称不能为空", trigger: "blur" },
        ],
      },
      // 摄像机列表
      cameraOptions: [],
    };
  },
  computed: {
    ...mapGetters(["info"]),
    orgId() {
      return this.info.user.orgId;
    }
  },
  watch: {
    /* 单击节点传来对的orgId，请求油站信息 */
    org_Id2(val) {
      // this.drawPolyline()
      console.log("单击节点传来对的orgId: ", val);
      const arr = Array.from(document.querySelectorAll(".camera-icon"));
      console.log('arr: ', arr);
      if (arr.length) {
        arr.map((item) => {
          item.remove();
        });
      }
      this.formCamera.orgId = parseInt(val);
      val && this.getPetrolStation();
      val && this.renderImage();
    },
    /* 监听平面图的打开和关闭*/
    isPreview(val) {
      !val ? (this.imageUrl = null) : val;
      !val ? (this.org_Id2 = null) : val;
      if (!val) {
        const arr = Array.from(document.querySelectorAll(".camera-icon"));
        if (arr.length) {
          arr.map((item) => {
            item.remove();
          });
        }
      }
    },
    "form.orgId"(val) {
      this.org_Id2 = val ? val : this.org_Id2;
      console.log("this.org_Id2: ", this.org_Id2);
    },
    "formCamera.orgId"(val) {
      val && this.getCameraList();
    },
    visible(val) {
      if (!val) {
        this.isRequest = false;
        this.form = {
          orgId: null, // 机构部门
          address: null, // 机构地址
          name: null, // 地图名称
          mapUrl: null, // 上传的图片url

          longitude: null,
          latitude: null,
        };
      }
    },
  },
  created() {
    this.deptOptions = this.info.deptPermission;
    this.getCenterLevel();
  },
  mounted() {
    this.getStationIcon().then(res => {
      console.log("获取加油站图标: ", res);
      this.list = res.data;
      this.getCameraMarker();
    })
  },
  beforeDestroy() {
    console.log("地图销毁了");
    this.map && this.map.destroy();
  },
  methods: {
    /* 网络请求 */
    // 获取加油站图标
    getStationIcon() {
      return new Promise((resolve, reject) => {
        getStationIcon().then((res) => {
          resolve(res)
        });
      })
    },
    // 获取中心点
    getCenterLevel() {
      /* 发送请求 */
      getCenterLevel({ userId: this.orgId }).then((res) => {
        console.log("获取中心点的res: ", res);
        if (res.code === 200) {
          this.size[0] = parseInt(res.data.iconW);
          this.size[1] = parseInt(res.data.iconH);
          this.zoom = parseFloat(res.data.mapRank);
          this.center[0] = parseFloat(res.data.centreLongitude);
          this.center[1] = parseFloat(res.data.centreLatitude);
        }
      });
    },
    /* 查询地图上的摄像头图标 */
    getCameraMarker() {
      getCameraMarker().then((res) => {
        console.log("查询地图上的摄像头图标res: ", res);
        this.cameraMarkerList = res.data;
        this.initAMap();
      });
    },
    // 查询地图站点信息
    getPetrolStation() {
      this.$emit("openValve", false);
      getPetrolStation({ orgId: this.org_Id2 }).then((res) => {
        console.log("查询地图信息res: ", res);
        this.form.id = res.id;
        this.form.orgId = parseInt(res.orgId);
        this.form.address = res.address;
        this.form.name = res.name;
        this.form.mapUrl = res.mapUrl;
        this.form.longitude = res.longitude;
        this.form.latitude = res.latitude;

        this.mapUrl = res.mapUrl;
        this.$emit("openValve", true);
      });
    },
    /* 获取摄像头列表 */
    getCameraList() {
      getCameraList({ orgId: this.formCamera.orgId }).then((res) => {
        console.log("获取摄像头列表", res);
        if (res.code === 200) {
          this.cameraOptions = res.rows;
        }
      });
    },
    /* 发送请求 保存站点信息和站点 */
    saveStationInfo() {
      const id = this.form.id;
      const orgId = this.form.orgId;
      const address = this.form.address;
      const name = this.form.name;
      const mapUrl = this.form.mapUrl;
      const longitude = this.form.longitude;
      const latitude = this.form.latitude;
      const data = {
        orgId,
        address,
        name,
        mapUrl,
        longitude,
        latitude,
        id,
      };
      saveStationInfo(data).then((res) => {
        console.log("保存站点信息", res);
        if (res.code === 200) {
          this.$message.success("保存成功");
          this.handleCancel();
          this.getPetrolStation();
        } else {
          this.$message.success("保存失败");
        }
      });
      /* 添加加油站图标 */
      const data2 = {
        orgId,
        longitude,
        latitude,
      };
      addStation(data2).then((res) => {
        console.log("添加加油站", res);
        if (res.code === 200) {
          this.$notify.success("添加成功");
          this.handleCancel();
          this.getStationIcon();
        } else {
          this.$notify.error("添加失败");
        }
      });
    },
    /* dialog */
    // 处理保存站点信息
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.geoCode();
        }
      });
    },
    /* 重置表单 */
    reset() {
      this.form = {
        id: null, // id
        orgId: null, // 机构部门
        address: null, // 机构地址
        name: null, // 地图名称
        mapUrl: null, // 上传的图片url

        longitude: null,
        latitude: null,
      };
      this.resetForm("form");
    },
    // 处理保存站点信息dialog关闭
    handleCancel() {
      this.reset();
      this.visible = false;
    },
    // 处理图片上传成功
    handleSuccess(res, file) {
      console.log("上传图片res: ", res);
      if (res.code === 200) this.form.mapUrl = res.data.url;
    },
    /* 添加监控保存 */
    handleOk2() {
      console.log(this.formCamera);
      const form = this.formCamera;
      const id = form.id;
      const longitude = form.longitude;
      const latitude = form.latitude;
      const isMark = 1;
      const data = {
        id,
        longitude,
        latitude,
        isMark,
      };

      saveCamera(data).then((res) => {
        console.log("添加监控", res);
        if (res.code === 200) {
          this.$message.success("添加成功");
          this.getCameraMarker();
        } else {
          this.$message.success("添加失败");
        }
      });
      this.handleCancel2();
    },
    /* 添加监控关闭 */
    handleCancel2() {
      this.$refs.formCamera.resetFields();
      this.cameraOptions = [];
      this.visible2 = false;
    },

    /** 转换部门数据结构 */
    normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.children,
        isDisabled: node.type == "1" ? true : false,
      };
    },
    // 创建dom节点
    createNode(item) {
      let image = this.$refs.image;
      let div = document.createElement("div");
      let img = document.createElement("img");
      let p = document.createElement("p");
      div.style.position = "absolute";
      div.style.top = parseInt(item.mapPositionY) - 17.5 + "px";
      div.style.left = parseInt(item.mapPositionX) - 17.5 + "px";
      div.style.width = "40px";
      div.style.height = "40px";
      div.style.borderRadius = "10px";
      div.style.textAlign = "center";
      div.className = "camera-icon";
      div.style.cursor = "pointer";

      img.src = require("@/assets/images/home/监控.png");
      img.style.width = "40px";

      p.style.position = "absolute";
      p.style.boxSizing = "borderBox";
      p.style.padding = "0 8px";
      p.style.height = "30px";
      p.style.lineHeight = "30px";
      p.style.textAlign = "center";
      p.style.boxShadow = "0 1px 2px rgb(0 0 0 / 10%)";
      p.style.backgroundColor = "#fff";
      p.style.borderRadius = "4px";
      p.style.fontSize = "14px";
      p.style.fontWeight = "500";
      p.style.color = "#409EFF";
      p.style.whiteSpace = "nowrap";
      p.style.transform = "translate(-30px, -70px)";
      p.innerText = item.name;

      div.appendChild(img);
      div.appendChild(p);
      image.appendChild(div);
      div.addEventListener("click", (e) => {
        this.$confirm("此操作将永久删除该图标, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        })
          .then(() => {
            this.handleRemovePlanCamera(item);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      });
    },
    /* 渲染平面图摄像头图标 */
    renderImage() {
      getCameraList({ orgId: this.formCamera.orgId }).then((res) => {
        console.log("获取摄像头列表", res);
        if (res.code === 200) {
          this.cameraOptions = res.rows;

          if (this.cameraOptions.length > 0) {

            this.cameraOptions.forEach((item) => {
              if (item.isMap === 1) {
                this.createNode(item);
              }
            });
          }
        }
      });
    },
    /* 删除平面图上的所有图标 */
    removeCameraIcon() {
      const cameraIcons = document.querySelectorAll('.camera-icon');
      cameraIcons.forEach(item => {
        item.remove()
      })
    },
    /* 平面图添加摄像头 保存 */
    handleOkCamera() {
      this.$refs.formCamera.validate((valid) => {
        if (!valid) return;
        const arr = this.cameraOptions.filter((item) => {
          return item.id == this.formCamera.id;
        });
        const obj = arr[0];
        /* 发送请求 */
        const data = {
          id: this.formCamera.id,
          orgId: this.formCamera.orgId,
          mapPositionX: this.offsetX,
          mapPositionY: this.offsetY,
          isMap: 1,
        };
        saveCamera(data).then((res) => {
          console.log("平面图添加摄像头: ", res);
          if (res.code == 200) {
            this.$notify.success("添加成功");
            this.removeCameraIcon()
            this.renderImage();
          } else {
            this.$notify.success("添加失败");
          }
          this.handleCloseCamera();
        });
      });
    },
    /* 处理删除平面图 摄像头图标 */
    handleRemovePlanCamera(item) {
      const params = {
        id: item.id,
        isMap: 0,
      };
      deletePlanCamera(params).then((res) => {
        console.log("处理删除摄像头图标: ", res);
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.removeCameraIcon()
          this.renderImage();
        } else {
          this.$message.success("删除失败");
        }
      });
    },
    /* 初始化地图 */
    initAMap() {
      let that = this;
      let lng, lat;
      let iconW;
      let iconH;
      let zoom;
      const obj = JSON.parse(sessionStorage.getItem("centerObj"));
      if (obj instanceof Object) {
        iconW = obj.size[0];
        iconH = obj.size[1];
        lng = obj.center[0];
        lat = obj.center[1];
        zoom = obj.zoom;
      } else {
        if (this.center.length) {
          iconW = this.size[0];
          iconH = this.size[1];
          lng = this.center[0];
          lat = this.center[1];
          zoom = this.zoom;
        } else {
          iconW = 30;
          iconH = 30;
          lat = 39.919124;
          lng = 116.37353;
          zoom = 14;
        }
      }
      that.center = [lng, lat];

      // 实例化地图
      that.map = new AMap.Map("container", {
        center: that.center, //初始地图中心点
        zoom: zoom,
        resizeEnable: true, //是否监控地图容器尺寸变化
        features: ["bg", "road", "building"],
      });
      const map = that.map;
      // 创建一个右键菜单实例
      let contextMenu = new AMap.ContextMenu();
      this.contextMenu = contextMenu;
      //右键菜单距离量测
      contextMenu.addItem(
        "添加站点",
        function (e) {
          console.log("that.contextMenuPositon: ", that.contextMenuPositon);
          that.visible = true;
          that.$emit("handleVisible", true);
          contextMenu.close();
        },
        0
      );
      contextMenu.addItem(
        "添加监控",
        (e) => {
          this.formCamera.longitude = this.contextMenuPositon.lng;
          this.formCamera.latitude = this.contextMenuPositon.lat;
          this.visible2 = true;
          contextMenu.close();
        },
        0
      );
      contextMenu.addItem(
        "添加防区",
        () => {
          if (this.editStatus == false) {
            this.drawPolygon();
          }
          contextMenu.close();
        },
        0
      );
      contextMenu.addItem("保存预览", function (e) {
        that.form.lng = that.contextMenuPositon.lng;
        that.form.lat = that.contextMenuPositon.lat;
        const center = [that.form.lng, that.form.lat];
        // 获取缩放级别
        const zoom = that.map.getZoom();
        // 获取图标大小
        let size = that.marker._size ? that.marker._size : [20, 20];
        that.form.center = center;
        that.form.zoom = zoom;
        that.form.size = size;
        sessionStorage.setItem("centerObj", JSON.stringify(that.form));

        const userId = that.orgId;
        const iconW = size[0];
        const iconH = size[1];
        const centreLongitude = that.form.lng;
        const centreLatitude = that.form.lat;
        const mapRank = zoom;
        const data = {
          userId,
          iconW,
          iconH,
          centreLongitude,
          centreLatitude,
          mapRank,
        };
        // 发送请求
        addCenterLevel(data).then((res) => {
          console.log("添加中心点 ", res);
          if (res.code === 200) {
            that.$message.success("设置成功");
          } else {
            that.$message.success("设置失败");
          }
        });
        contextMenu.close();
      });

      //地图绑定鼠标右击事件——弹出右键菜单
      that.map.on("rightclick", function (e) {
        //右键菜单位置
        that.contextMenuPositon = e.lnglat;
        contextMenu.open(that.map, e.lnglat);
      });

      /* Marker区域 */
      /* 渲染加油站图标 */
      if (that.list.length > 0) {
        that.list.forEach((item) => {
          if (item.status === 1) {
            item.longitude = item.longitude ? item.longitude : 0;
            item.latitude = item.latitude ? item.latitude : 0;
            let lnglat = new AMap.LngLat(
              parseFloat(item.longitude),
              parseFloat(item.latitude)
            );
            let icon = item.handleStatus
              ? require("@/assets/images/home/warning.gif")
              : require("@/assets/images/home/icon.gif");
            const marker = new AMap.Marker({
              position: lnglat,
              icon: new AMap.Icon({
                image: icon,
                size: new AMap.Size(iconW, iconH), //图标所处区域大小
                imageSize: new AMap.Size(iconW, iconH), //图标大小
              }),
              offset: new AMap.Pixel(0, 0),
            });
            this.map.add(marker);
            this.marker = marker;

            item.marker = marker;

            let contextMarkerMenu = new AMap.ContextMenu();
            //给 Maker 绑定单击事件
            marker.on("click", () => {
              console.log("item: ", item);
              this.org_Id2 = item.orgId;
              this.$emit("changeOrgId", item.orgId);
              this.isPreview = true;
              contextMarkerMenu.close();
            });

            // 右键菜单
            contextMarkerMenu.addItem(
              "删除站点",
              function () {
                that
                  .$confirm("此操作将删除该图标, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                  })
                  .then(() => {
                    that.handleRemoveMarker(that.map, item);
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消删除",
                    });
                  });
                contextMarkerMenu.close();
              },
              0
            );

            //绑定鼠标右击事件——弹出右键菜单
            marker.on("rightclick", function (e) {
              contextMarkerMenu.open(that.map, lnglat);
            });

            marker.on("mouseover", () => {
              this.openInfo(item);
            });
            marker.on("mouseout", () => {
              this.closeInfo();
            });

            that.map.on('zoomchange', () => {
              that.logMapinfo();
              if (this.zoom_ >= 15) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(40, 40), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(40, 40), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 15 && this.zoom_ >= 14) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(35, 35), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(35, 35), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 14 && this.zoom_ >= 13) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(30, 30), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(30, 30), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 13 && this.zoom_ >= 12) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(23, 23), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(23, 23), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 12 && this.zoom_ >= 11) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(15, 15), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(15, 15), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 11 && this.zoom_ >= 10) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(10, 10), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(10, 10), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 10 && this.zoom_ >= 9) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(5, 5), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(5, 5), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              }
            });
          }
        });
      }
      /* 处理监控图标的渲染 */
      if (that.cameraMarkerList.length > 0) {
        that.cameraMarkerList.forEach((item) => {
          if (item.isMark === 1) {
            item.longitude = item.longitude ? item.longitude : 0;
            item.latitude = item.latitude ? item.latitude : 0;
            let lnglat = new AMap.LngLat(
              parseFloat(item.longitude),
              parseFloat(item.latitude)
            );
            let icon = require("@/assets/images/home/监控.png");
            const cameraMarker = new AMap.Marker({
              position: lnglat,
              icon: new AMap.Icon({
                image: icon,
                size: new AMap.Size(iconW, iconH), //图标所处区域大小
                imageSize: new AMap.Size(iconW, iconH), //图标大小
              }),
              offset: new AMap.Pixel(0, 0),
            });
            this.map.add(cameraMarker);
            this.cameraMarker = cameraMarker;

            /* 创建一个右键菜单实例 */
            let contextMarkerMenu = new AMap.ContextMenu();
            /* 摄像机图标右键单击事件 */
            cameraMarker.on("rightclick", (e) => {
              //右键菜单位置
              this.contextMenuPositon = e.lnglat;
              contextMarkerMenu.open(this.map, e.lnglat);
            });

            cameraMarker.on("click", () => {
              contextMarkerMenu.close();
            });

            cameraMarker.on("mouseover", () => {
              this.openInfoCamera(item);
            });
            cameraMarker.on("mouseout", () => {
              this.closeInfoCamera();
            });

            // 右键菜单
            contextMarkerMenu.addItem(
              "删除监控",
              () => {
                this.$confirm("此操作将删除该图标, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    this.handleRemoveCamera(item);
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消删除",
                    });
                  });
                contextMarkerMenu.close();
              },
              0
            );

            // 监听地图的缩放
            that.map.on("zoomchange", () => {
              that.logMapinfo();
              if (this.zoom_ >= 15) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(40, 40), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(40, 40), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);

              } else if (this.zoom_ < 15 && this.zoom_ >= 14) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(35, 35), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(35, 35), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 14 && this.zoom_ >= 13) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(30, 30), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(30, 30), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 13 && this.zoom_ >= 12) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(23, 23), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(23, 23), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 12 && this.zoom_ >= 11) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(15, 15), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(15, 15), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 11 && this.zoom_ >= 10) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(10, 10), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(10, 10), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 10 && this.zoom_ >= 9) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(5, 5), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(5, 5), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              }
            });
          }
        });
      }

      /* 渲染区域 */
      this.renderPolygon()

      /* 绘制轨迹 */
      this.drawPolyline()

      //绑定地图移动与缩放事件
      that.map.on("moveend", that.logMapinfo);
      that.map.on("zoomend", that.logMapinfo);
    },
    /* 处理平面图关闭事件 */
    handleCloseMapImage() {
      this.org_Id2 = null;
      this.mapUrl = null;
      this.isPreview = false;
    },

    // 处理删除加油站图标
    handleRemoveMarker(map, item) {
      unMarkerStation({ id: item.id }).then((res) => {
        console.log("删除加油站图标: ", res);
        if (res.code === 200) {
          this.$message.success("删除成功");
          map.remove(item.marker);
          this.getStationIcon();
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    /* 处理删除摄像头图标 */
    handleRemoveCamera(item) {
      const params = {
        cameraId: item.id,
      };
      deleteCamera(params).then((res) => {
        console.log("处理删除摄像头图标: ", res);
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.getCameraMarker();
        } else {
          this.$message.success("删除失败");
        }
      });
    },
    /* 加油站图标的信息窗体 */
    openInfo(item) {
      //构建信息窗体中显示的内容
      let info = [];
      let lnglat = new AMap.LngLat(
        parseFloat(item.longitude),
        parseFloat(item.latitude)
      );
      info.push(
        `<div>
          <span style="font-weight:500;font-size: 20px;color: #409EFF;transform: translate(5px)">${item.name}</span>
         </div>`
      );
      this.infoWindow = new AMap.InfoWindow({
        content: info.join(""), //使用默认信息窗体框样式，显示信息内容
        offset: new AMap.Pixel(10, 0),
      });
      this.infoWindow.on("open", this.showInfoOpen);
      this.infoWindow.on("close", this.showInfoClose);
      this.infoWindow.open(this.map, lnglat);
    },
    closeInfo() {
      //先判断 否则this.infoWindow可能为null
      if (this.infoWindow == null) {
        this.message = "信息窗体已经关闭了！";
      } else {
        this.infoWindow.close();
        this.message = "您关闭了信息窗体！";
      }
    },
    /* 摄像机图标的信息窗体 */
    openInfoCamera(item) {
      //构建信息窗体中显示的内容
      let info = [];
      let lnglat = new AMap.LngLat(
        parseFloat(item.longitude),
        parseFloat(item.latitude)
      );
      info.push(
        `<div>
          <span style="font-weight:500;font-size: 20px;color: #409EFF;transform: translate(5px)">${item.name}</span>
         </div>`
      );
      this.infoWindow = new AMap.InfoWindow({
        content: info.join(""), //使用默认信息窗体框样式，显示信息内容
        offset: new AMap.Pixel(10, 0),
      });
      this.infoWindow.on("open", this.showInfoOpen);
      this.infoWindow.on("close", this.showInfoClose);
      this.infoWindow.open(this.map, lnglat);
    },
    closeInfoCamera() {
      //先判断 否则this.infoWindow可能为null
      if (this.infoWindow == null) {
        this.message = "信息窗体已经关闭了！";
      } else {
        this.infoWindow.close();
        this.message = "您关闭了信息窗体！";
      }
    },

    /* 处理保存图片标记dialog */
    handleOk_a() {
      this.handleCancel_a();
    },

    /* 处理关闭图片标记dialog */
    handleCancel_a() {
      this.visible_a = false;
      this.$emit("visibleA", false);
    },
    /* 鼠标右键事件 */
    rightEvent(e) {
      if (!this.mapUrl) return this.$message.info("暂无图片");
      this.cameraVisible = true;
      this.getCameraList();
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    /* 选择摄像机对话框关闭 */
    handleCloseCamera() {
      this.formCamera.id = null;
      this.cameraVisible = false;
    },
    // 获取当前地图级别 获取当前地图中心位置
    logMapinfo() {
      const zoom = this.map.getZoom(); //获取当前地图级别
      const center = this.map.getCenter(); //获取当前地图中心位置

      this.zoom_ = zoom;
      this.center = [center.lng, center.lat];

      let size = this.marker._size ? this.marker._size : [20, 20];
      const obj = {
        zoom: zoom,
        center: center,
        size,
      };
      sessionStorage.setItem("centerObj", JSON.stringify(obj));
    },
    /* 获取并清除 某类覆盖物 */
    delAllOverlays(type) {
      const arr = this.map.getAllOverlays(type)
      this.map.remove(arr)
    },
    /* 渲染多边形-防区 */
    renderPolygon() {
      getPolygonList().then(res => {
        this.polygonList = res.rows;
        if (this.polygonList.length) {
          this.polygonList.forEach(item => {
            let polygon = new AMap.Polygon({
              map: this.map,
              path: JSON.parse(item.coord),//设置多边形边界路径
              strokeColor: "#FF33FF", //线颜色
              strokeOpacity: 0.2, //线透明度
              strokeWeight: 3,    //线宽
              fillColor: "#1791fc", //填充色
              fillOpacity: 0.35,//填充透明度
              zIndex: 99
            });
            let contextMenu = new AMap.ContextMenu();
            contextMenu.addItem(
              '编辑防区',
              (e) => {
                this.drawer = true;
                this.editStatus = true;
                this.Editor(polygon, item.id)
                contextMenu.close()
              },
              0
            );
            contextMenu.addItem(
              '删除防区',
              () => {
                this
                  .$confirm('此操作将删除该防区, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                  })
                  .then(() => {
                    this.handleRemovePolygon(item.id)
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除',
                    });
                  });
                contextMenu.close()
              },
              0
            );
            polygon.on('rightclick', (e) => {
              contextMenu.open(this.map, e.lnglat);
            })
          })
        }
      })
    },
    /* 删除多边形-防区 */
    handleRemovePolygon(id) {
      delPolygon({ id }).then((res) => {
        console.log('删除防区: ', res);
        if (res.code === 200) {
          this.$message.success('删除成功');
          // 重新渲染
          this.delAllOverlays('polygon')
          this.renderPolygon()
        } else {
          this.$message.error('删除失败');
        }
      });
    },
    // 绘制多边形
    drawPolygon() {
      this.map.setDefaultCursor('crosshair');
      // 创建绘图工具
      this.mouseTool = new AMap.MouseTool(this.map);
      // 画图工具
      this.mouseTool.polygon({
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.2, //线透明度
        strokeWeight: 3,    //线宽
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.35,//填充透明度
        strokeStyle: 'solid',
      });
      /* 覆盖物对象绘制完成 */
      this.mouseTool.on('draw', (event) => {
        this.map.setDefaultCursor('default');
        //清除绘制的多边形
        this.mouseTool.close(true);

        this.contextMenu.close()
        const arr = event.obj.getPath();
        if (arr.length < 3) return

        // event.obj 为绘制出来的覆盖物对象
        console.log('绘制出来的覆盖物', arr);
        const newArr = []
        arr.forEach((item) => {
          const lng = item.lng;
          const lat = item.lat;
          const arrItem = [lng, lat]
          newArr.push(arrItem)
        });

        const data = {
          coord: JSON.stringify(newArr)
        }
        savePolygon(data).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            // 重新渲染
            this.delAllOverlays('polygon')
            this.renderPolygon()
          } else {
            this.$message.error('添加失败')
          }
        })
      });
    },
    // 编辑多变形
    Editor(polygon, id) {
      this.map.setDefaultCursor('crosshair');
      let polyEditor = new AMap.PolyEditor(this.map, polygon);
      this.polyEditor = polyEditor;
      polyEditor.setTarget(polygon);

      polyEditor.open();
      this.editStatus = true;

      /* 编辑结束触发 */
      polyEditor.on('end', (event) => {
        this.map.setDefaultCursor('default');
        // event.target 即为编辑后的多边形对象
        console.log(event.target.getPath());
        const arr = event.target.getPath();
        if (arr.length < 3) return
        const newArr = []
        arr.forEach((item) => {
          const lng = item.lng;
          const lat = item.lat;
          const arrItem = [lng, lat]
          newArr.push(arrItem)
        });

        const data = {
          id,
          coord: JSON.stringify(newArr)
        }
        savePolygon(data).then(res => {
          console.log('编辑多变形: ', res);
          if (res.code === 200) {
            this.$message.success('编辑成功')
            // 重新渲染
            this.delAllOverlays('polygon')
            this.renderPolygon()
          } else {
            this.$message.error('编辑失败')
          }
        })
      });
    },
    // 结束编辑
    editClose() {
      this.polyEditor.close();
      this.drawer = false;
      this.editStatus = false;
    },
    /* 绘制轨迹 */
    drawPolyline() {
      this.initPolyline()

      // 方案一
      /* let count = 0;
      setInterval(() => {
        if (count > this.lineArr.length - 1) return
        this.map.remove(this.carMarker);
        this.carMarker = null;
        this.carMarker = new AMap.Marker({
          map: this.map,
          position: lineArr[count],
          icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
          offset: new AMap.Pixel(-13, -26),
        });
        count++;
      }, 1000); */
    },
    // 开启动画
    startAnimation() {
      this.carMarker.moveAlong(this.lineArr, {
        // 每一段的时长
        duration: 100,//可根据实际采集时间间隔设置
        // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
        autoRotation: true,
      });
    },
    // 初始化轨迹
    initPolyline() {
      /* orgId 暂写103 */
      getCarPlace({ orgId: '103' }).then(res => {
        console.log('车辆轨迹: ', res);
        this.lineArr = res.data;
        if (this.lineArr.length) {
          this.lineArr.forEach(item => {
            const lineArr = JSON.parse(item.coordinate);
            const currentLatLng = JSON.parse(item.selfy);

            let polyline = new AMap.Polyline({
              map: this.map,
              path: lineArr,
              showDir: true,
              strokeColor: "#28F",  //线颜色
              // strokeOpacity: 1,     //线透明度
              strokeWeight: 6,      //线宽
              // strokeStyle: "solid"  //线样式
            });

            // 起点
            let startPoint = new AMap.Marker({
              map: this.map,
              position: lineArr[0],
              // icon: require('@/assets/images/home/6起点.png'),
              icon: new AMap.Icon({
                image: require('@/assets/images/home/6起点.png'),
                size: new AMap.Size(35, 35),
                imageSize: new AMap.Size(35, 35), //图标大小
              }),
              offset: new AMap.Pixel(-18, -32),
            });

            // 终点
            let endPoint = new AMap.Marker({
              map: this.map,
              position: lineArr[lineArr.length - 1],
              // icon: require('@/assets/images/home/9终点.png'),
              icon: new AMap.Icon({
                image: require('@/assets/images/home/9终点.png'),
                size: new AMap.Size(35, 35),
                imageSize: new AMap.Size(35, 35), //图标大小
              }),
              offset: new AMap.Pixel(-18, -30),
            });

            // 小车
            this.carMarker = new AMap.Marker({
              map: this.map,
              position: currentLatLng,
              icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
              offset: new AMap.Pixel(-13, -26),
            });
          })
        }
      })
    },

    /* 地区转经纬度 */
    handleChange() {
      this.geoCode();
    },
    geoCode() {
      let that = this;
      let geocoder = new AMap.Geocoder({
        city: "全国",
      });
      geocoder.getLocation(that.form.address, function (status, result) {
        console.log("status: ", status);
        console.log("result: ", result);
        if (status === "complete" && result.geocodes.length) {
          let lnglat = result.geocodes[0].location;
          that.form.longitude = lnglat.lng;
          that.form.latitude = lnglat.lat;
          that.saveStationInfo();
        } else {
          that.$message.error("根据地址查询位置失败");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.map_con {
  position: absolute;
  width: 77.5%;
  height: 100%;
  border-radius: 8px;
}

.map {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.map_con .image_preview {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow-y: scroll;
  .el-image {
    position: relative;
    border-radius: 8px;
    cursor: pointer;
  }
  .back {
    position: absolute;
    top: 5px;
    left: 5px;
    display: block;
    border-radius: 4px;
    z-index: 99;
  }
}

/* dialog编辑图片 */
.image,
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #eee;
  border-radius: 8px 8px 0 0;
  font-size: 20px;
  font-weight: 500;
  color: #19adca;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 8px;
}
.avatar {
  border-radius: 8px;
}
::v-deep .avatar-uploader .el-upload:hover {
  border: 1px dashed #409eff !important;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.con {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: 10px;
  right: 10px;

  padding: 15px 20px;
  width: 300px;
  background-color: #fff;
  border-radius: 12px;
  z-index: 9;
}

.con ::v-deep .el-button:first-child {
  transform: translate(2%);
}
.con ::v-deep .el-button {
  margin-bottom: 10px;
  width: 100%;
}

.con ::v-deep .el-button:last-child {
  margin: 0;
  transform: translate(2%);
}

::v-deep .amap-info-content,
.amap-info-outer {
  border-radius: 8px;
}

::v-deep .amap-info-content,
.amap-info-outer {
  text-align: center;
  font-weight: 500;
}
::v-deep .amap-info-close {
  display: none;
}

::v-deep .amap-menu-outer {
  font-weight: 500;
  border-radius: 8px;
}
::v-deep ul.amap-menu-outer li:hover {
  background-color: #f3f3eed5;
  border-radius: 8px;
}

::v-deep .amap-logo {
  display: none !important;
}
::v-deep .amap-copyright {
  display: none !important;
}

::v-deep .bottom-center .amap-info-sharp,
.bottom-center .amap-info-sharp:after {
  display: none;
}
</style>
