import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setInitialLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const handleUpload = (type: string) => {
    setIsLoading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const StatCard = ({ title, value, icon, trend }: { title: string; value: string; icon: string; trend?: string }) => (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && <Badge variant="secondary" className="mt-2">{trend}</Badge>}
          </div>
          <Icon name={icon} size={32} className="text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  const StraussStar = ({ progress, className }: { progress: number; className?: string }) => (
    <div className={`relative ${className}`}>
      <svg
        width="60"
        height="60"
        viewBox="0 0 200 200"
        className={`transform transition-all duration-300 ${progress > 0 ? 'animate-glow-pulse' : ''}`}
        style={{ 
          filter: progress > 50 ? 'drop-shadow(0 0 20px rgba(74, 144, 226, 0.6))' : 'none',
          transform: `scale(${0.8 + (progress / 100) * 0.4}) rotate(${(progress / 100) * 360}deg)`
        }}
      >
        {/* Strauss Star Petals */}
        {[
          { color: '#8FBC8F', rotation: 0 },    // Light green
          { color: '#9ACD32', rotation: 36 },   // Yellow green
          { color: '#FF8C00', rotation: 72 },   // Orange
          { color: '#DC143C', rotation: 108 },  // Red
          { color: '#B22222', rotation: 144 },  // Dark red
          { color: '#4169E1', rotation: 180 },  // Royal blue
          { color: '#1E90FF', rotation: 216 },  // Dodger blue
          { color: '#87CEEB', rotation: 252 },  // Sky blue
          { color: '#B0E0E6', rotation: 288 },  // Powder blue
          { color: '#98FB98', rotation: 324 }   // Pale green
        ].map((petal, index) => {
          const petalProgress = Math.max(0, Math.min(100, (progress - index * 10) * 1.2));
          return (
            <path
              key={index}
              d="M100,100 Q120,60 140,100 Q120,140 100,100"
              fill={petalProgress > 0 ? petal.color : 'transparent'}
              stroke={petalProgress > 0 ? petal.color : '#333'}
              strokeWidth="1"
              opacity={petalProgress / 100}
              transform={`rotate(${petal.rotation} 100 100)`}
              style={{
                transition: 'all 0.3s ease-out'
              }}
            />
          );
        })}
        
        {/* Center circle */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill={progress > 80 ? '#4A90E2' : '#333'}
          className="transition-all duration-300"
        />
      </svg>
      
      {/* Progress ring */}
      <div className="absolute inset-0 rounded-full">
        <svg width="60" height="60" className="transform -rotate-90">
          <circle
            cx="30"
            cy="30"
            r="28"
            stroke="rgba(74, 144, 226, 0.2)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="30"
            cy="30"
            r="28"
            stroke="#4A90E2"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
            className="transition-all duration-300 ease-out"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(74, 144, 226, 0.8))'
            }}
          />
        </svg>
      </div>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background font-roboto dark flex items-center justify-center">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex flex-col items-center space-y-6">
            <StraussStar progress={loadingProgress} className="mb-4" />
            <div>
              <h1 className="text-3xl font-montserrat font-bold mb-2">STRAUSS LOGISTICS</h1>
              <p className="text-lg text-muted-foreground">Система оптимизации транспортных расходов</p>
            </div>
          </div>
          
          <div className="w-64 mx-auto space-y-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {loadingProgress < 30 ? 'Инициализация системы...' :
               loadingProgress < 60 ? 'Загрузка компонентов...' :
               loadingProgress < 90 ? 'Подготовка интерфейса...' :
               'Почти готово!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto dark">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Strauss Logo with Loading Animation */}
              <div className="relative">
                {isLoading ? (
                  <StraussStar progress={uploadProgress} className="w-10 h-10" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-montserrat font-bold">STRAUSS LOGISTICS</h1>
                <p className="text-sm text-muted-foreground">Система оптимизации транспортных расходов</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-500 border-green-500">
                <Icon name="Wifi" size={12} className="mr-1" />
                Онлайн
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dashboard">Панель управления</TabsTrigger>
            <TabsTrigger value="docs">Документация</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard 
                title="Общая экономия" 
                value="₽2,847,320" 
                icon="TrendingUp" 
                trend="+18.2%" 
              />
              <StatCard 
                title="Обработано заказов" 
                value="1,247" 
                icon="Package" 
                trend="+12%" 
              />
              <StatCard 
                title="Активные маршруты" 
                value="89" 
                icon="Route" 
              />
              <StatCard 
                title="Средняя стоимость" 
                value="₽3,420" 
                icon="Calculator" 
                trend="-8.4%" 
              />
            </div>

            {/* Loading Progress */}
            {isLoading && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Upload" className="animate-bounce" />
                    <span>Загрузка данных...</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% завершено</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Control Panel */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon name="Settings" />
                      <span>Управление данными</span>
                    </CardTitle>
                    <CardDescription>
                      Загрузите файлы и запустите анализ для оптимизации маршрутов
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        onClick={() => handleUpload('rates')}
                        disabled={isLoading}
                        className="h-16 flex flex-col space-y-1"
                      >
                        <Icon name="FileText" size={20} />
                        <span>Загрузить тарифы</span>
                      </Button>
                      <Button 
                        onClick={() => handleUpload('orders')}
                        disabled={isLoading}
                        className="h-16 flex flex-col space-y-1"
                        variant="outline"
                      >
                        <Icon name="ShoppingCart" size={20} />
                        <span>Загрузить заказы</span>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <Button variant="secondary" className="h-12">
                        <Icon name="BarChart3" className="mr-2" />
                        Проанализировать
                      </Button>
                      <Button variant="secondary" className="h-12">
                        <Icon name="Calculator" className="mr-2" />
                        Общая стоимость
                      </Button>
                      <Button variant="secondary" className="h-12">
                        <Icon name="Download" className="mr-2" />
                        Экспортировать
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon name="Filter" />
                      <span>Фильтры</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Дата</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите период" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="today">Сегодня</SelectItem>
                            <SelectItem value="week">Неделя</SelectItem>
                            <SelectItem value="month">Месяц</SelectItem>
                            <SelectItem value="quarter">Квартал</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Метод доставки</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Все методы" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="express">Экспресс</SelectItem>
                            <SelectItem value="standard">Стандарт</SelectItem>
                            <SelectItem value="economy">Эконом</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Город</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Все города" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="moscow">Москва</SelectItem>
                            <SelectItem value="spb">Санкт-Петербург</SelectItem>
                            <SelectItem value="ekb">Екатеринбург</SelectItem>
                            <SelectItem value="nsk">Новосибирск</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon name="PieChart" />
                      <span>Аналитика</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Экспресс доставка</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Стандартная</span>
                        <span className="font-semibold">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Эконом</span>
                        <span className="font-semibold">20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon name="MapPin" />
                      <span>Топ направления</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { city: 'Москва', orders: 342, savings: '₽127,400' },
                        { city: 'СПб', orders: 156, savings: '₽89,300' },
                        { city: 'Екатеринбург', orders: 89, savings: '₽45,200' },
                        { city: 'Новосибирск', orders: 67, savings: '₽32,100' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                          <div>
                            <p className="font-semibold">{item.city}</p>
                            <p className="text-xs text-muted-foreground">{item.orders} заказов</p>
                          </div>
                          <p className="text-green-500 font-semibold">{item.savings}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="FileText" />
                  <span>Документация по использованию</span>
                </CardTitle>
                <CardDescription>
                  Руководство по работе с системой оптимизации транспортных расходов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="fields" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="fields">Обязательные поля</TabsTrigger>
                    <TabsTrigger value="orders">Заказы</TabsTrigger>
                    <TabsTrigger value="rates">Тарифы</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fields" className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Обязательные поля для загрузки</h3>
                    <div className="grid gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Общие требования</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <p>• Формат файлов: Excel (.xlsx) или CSV</p>
                          <p>• Кодировка: UTF-8</p>
                          <p>• Максимальный размер файла: 50 МБ</p>
                          <p>• Обязательное наличие заголовков в первой строке</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Структура файла заказов</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-semibold text-primary mb-2">Обязательные поля:</h4>
                              <ul className="space-y-1">
                                <li>• order_id - ID заказа</li>
                                <li>• customer_id - ID клиента</li>
                                <li>• origin_city - Город отправки</li>
                                <li>• destination_city - Город назначения</li>
                                <li>• weight - Вес (кг)</li>
                                <li>• volume - Объем (м³)</li>
                                <li>• delivery_date - Дата доставки</li>
                                <li>• service_type - Тип услуги</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-muted-foreground mb-2">Дополнительные поля:</h4>
                              <ul className="space-y-1 text-muted-foreground">
                                <li>• priority - Приоритет</li>
                                <li>• special_requirements - Особые требования</li>
                                <li>• insurance_value - Страховая стоимость</li>
                                <li>• cod_amount - Наложенный платеж</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rates" className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Структура файла тарифов</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-semibold text-primary mb-2">Обязательные поля:</h4>
                              <ul className="space-y-1">
                                <li>• carrier_id - ID перевозчика</li>
                                <li>• origin_city - Город отправки</li>
                                <li>• destination_city - Город назначения</li>
                                <li>• service_type - Тип услуги</li>
                                <li>• rate_per_kg - Тариф за кг</li>
                                <li>• rate_per_m3 - Тариф за м³</li>
                                <li>• min_cost - Минимальная стоимость</li>
                                <li>• transit_time - Время доставки (дни)</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-muted-foreground mb-2">Дополнительные поля:</h4>
                              <ul className="space-y-1 text-muted-foreground">
                                <li>• fuel_surcharge - Топливная надбавка</li>
                                <li>• insurance_rate - Тариф страхования</li>
                                <li>• cod_fee - Комиссия за наложенный платеж</li>
                                <li>• volume_discount - Объемные скидки</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;