console.log("loaded quintus_extension");
Quintus.UI_extension = function(Q) {

  Q.UI.WrappableText = Q.Sprite.extend("UI.WrappableText", {
    init: function(p,defaultProps) {
      this._super(Q._defaults(p||{},defaultProps),{
        type: Q.SPRITE_UI,
        size: 24,
		w: Q.width - 10,
		h: 100,
      });

      this.splitLabel(Q.ctx);
    },

    splitLabel: function(ctx) {
      this.p.oldLabel = this.p.label;
      ctx.save();
      this.setFont(ctx);
      var splitLabel = this.p.label.split("\n");
      this.p.splitLabel = [];
      var maxLabel = "";
      var oldLabel = "";
      var width = 0;
      for(var i = 0; i < splitLabel.length; i++) {
        var words = splitLabel[i].split(" ");
        for(var j = 0; j < words.length; j++) {
          oldLabel = maxLabel;
          maxLabel += words[j];
          var metrics = ctx.measureText(maxLabel);
          if(metrics.width > this.p.w) {
            if(!oldLabel) {
              oldLabel = maxLabel;
 			}
            else {
              j--;
			}

            var metrics = ctx.measureText(oldLabel);
            if(width < metrics.width)
              width = metrics.width;
            this.p.splitLabel.push(oldLabel);
            maxLabel = "";
          }
          else if(j == words.length - 1) {
            this.p.splitLabel.push(maxLabel);
            if(width < metrics.width)
              width = metrics.width;
            maxLabel = "";
          }
          else {
            maxLabel += " ";
          }
        }
      }

      this.p.w = width;
      this.p.h = (this.p.size || 24) * this.p.splitLabel.length * 1.2;
      this.p.cx = this.p.w / 2;
      this.p.cy = this.p.h / 2;
      ctx.restore();
    },

    draw: function(ctx) {
      if(this.p.opacity === 0) { return; }

      if(this.p.oldLabel !== this.p.label) { this.splitLabel(ctx); }
      ctx.save();
      this.setFont(ctx);
      if(this.p.opacity !== void 0) { ctx.globalAlpha = this.p.opacity; }
      for(var i = 0; i < this.p.splitLabel.length; i++) {
        if(this.p.align === 'center') {      
          if(this.p.outlineWidth) {
            ctx.strokeText(this.p.splitLabel[i],0,-this.p.cy + i * this.p.size * 1.2);
          }
          ctx.fillText(this.p.splitLabel[i],0,-this.p.cy + i * this.p.size * 1.2);
        } else if(this.p.align === 'right') {
          if(this.p.outlineWidth) {
            ctx.strokeText(this.p.splitLabel[i],this.p.cx,-this.p.cy + i * this.p.size * 1.2);
          }
          ctx.fillText(this.p.splitLabel[i],this.p.cx,-this.p.cy + i * this.p.size * 1.2);
        } else { 
          if(this.p.outlineWidth) {
            ctx.strokeText(this.p.splitLabel[i],-this.p.cx,-this.p.cy +i * this.p.size * 1.2);
          }
          ctx.fillText(this.p.splitLabel[i], -this.p.cx, -this.p.cy + i * this.p.size * 1.2);
        }
      }
      ctx.restore();
    },

    setFont: function(ctx) {
      ctx.textBaseline = "top";
      ctx.font= this.font();
      ctx.fillStyle = this.p.color || "black";
      ctx.textAlign = this.p.align || "left";
      ctx.strokeStyle = this.p.outlineColor || "black";
      ctx.lineWidth = this.p.outlineWidth || 0;
    },

    font: function() {
      if(this.fontString) { return this.fontString; }

      this.fontString = (this.p.weight || "800") + " " +
                        (this.p.size || 24) + "px " +
                        (this.p.family || "Arial");

      return this.fontString;
    }

  });
};
