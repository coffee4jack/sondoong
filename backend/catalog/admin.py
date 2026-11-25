from django.contrib import admin

from .models import Category, ChatMessage, Membership, Merchant, Order, OrderLocation, Product, ScheduleException, Settlement, StoreSchedule


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ["name"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "stock", "available"]
    list_filter = ["category", "available"]
    search_fields = ["name"]


class OrderLocationInline(admin.TabularInline):
    model = OrderLocation
    extra = 0
    readonly_fields = ["recorded_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["code", "status", "total", "branch", "customer_name", "entered_at"]
    list_filter = ["status", "priority", "branch"]
    search_fields = ["code", "customer_name", "delivery_address"]
    readonly_fields = ["tracking_token"]
    inlines = [OrderLocationInline]


admin.site.register(ChatMessage)
admin.site.register(StoreSchedule)
admin.site.register(ScheduleException)
admin.site.register(Settlement)


class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 0


@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "zone", "commission_rate", "status"]
    list_filter = ["status", "category"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ["name"]}
    inlines = [MembershipInline]
